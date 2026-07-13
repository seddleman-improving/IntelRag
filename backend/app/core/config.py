from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    ollama_base_url: str = "http://192.168.100.224:11434"
    ollama_model: str = "qwen2.5:32b"
    ollama_embed_model: str = "nomic-embed-text"
    chroma_persist_dir: str = "./chroma_db"


settings = Settings()
