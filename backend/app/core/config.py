from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    llm_base_url: str
    llm_model: str
    embed_model: str
    chroma_persist_dir: str = "./chroma_db"


settings = Settings()
