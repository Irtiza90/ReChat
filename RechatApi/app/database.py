from databases import Database
from sqlalchemy import create_engine, MetaData

from .config import Settings

_settings = Settings()
DATABASE_URL = _settings.database_url

database = Database(DATABASE_URL)
metadata = MetaData()

# create SQLAlchemy engine, but run queries in databases lib.
engine = create_engine(DATABASE_URL)
