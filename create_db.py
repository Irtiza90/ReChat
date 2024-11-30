from sqlalchemy import create_engine
from app.models import metadata
from app.database import DATABASE_URL

# replace async engine with sync
engine = create_engine(DATABASE_URL.replace("mysql+aiomysql", "mysql+pymysql"))

# create all tables
metadata.create_all(engine)

print("Database tables created.")
