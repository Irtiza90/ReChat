from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ReChat"
    database_url: str
    react_app_url: str

    model_config = SettingsConfigDict(env_file=".env")
