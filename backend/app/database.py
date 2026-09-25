import logging
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger("yojanasetu.database")

Base = declarative_base()

# Configure database engine with connection pooling
# If remote Tiger Data PostgreSQL credentials are provided, use pool_size=10, max_overflow=10
db_url = settings.DATABASE_URL or ""

# Format URL for psycopg 3 if using standard postgresql://
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

engine_kwargs = {}
if "postgresql" in db_url:
    engine_kwargs = {
        "pool_size": 15,
        "max_overflow": 10,
        "pool_timeout": 30,
        "pool_pre_ping": True,
        "pool_recycle": 1800
    }
elif db_url.startswith("sqlite"):
    engine_kwargs = {
        "connect_args": {"check_same_thread": False}
    }

try:
    if db_url and "user:password" not in db_url:
        engine = create_engine(db_url, **engine_kwargs)
        with engine.connect() as conn:
            pass
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        logger.info("Connected and verified primary SQLAlchemy database engine.")
    else:
        logger.info("Database URL is placeholder or unconfigured. Using local SQLite database.")
        sqlite_url = "sqlite:///./yojanasetu_local.db"
        engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    logger.info(f"PostgreSQL connection deferred ({e}). Using local SQLite fallback.")
    sqlite_url = "sqlite:///./yojanasetu_local.db"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for yielding database session with automatic lifecycle cleanup."""
    if SessionLocal is None:
        yield None
        return

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create tables if they do not exist."""
    try:
        # Import models so they are registered with SQLAlchemy metadata
        import app.models  # noqa: F401
        if engine is not None:
            # Auto-enable pgvector extension on PostgreSQL
            if "postgresql" in str(engine.url):
                try:
                    with engine.connect() as conn:
                        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
                        conn.commit()
                        logger.info("PostgreSQL pgvector extension verified/enabled.")
                except Exception as e:
                    logger.info(f"Notice enabling pgvector extension (optional): {e}")
            Base.metadata.create_all(bind=engine)
            logger.info("Database schema verified/created successfully.")
    except Exception as e:
        logger.warning(f"Database schema auto-creation encountered notice: {e}")

