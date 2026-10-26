from sqlalchemy.dialects import postgresql
from sqlalchemy.schema import CreateIndex, CreateTable

from app.models import Base


def test_every_table_compiles_to_postgres_ddl():
    ddl = {}
    for table in Base.metadata.sorted_tables:
        ddl[table.name] = str(CreateTable(table).compile(dialect=postgresql.dialect()))
        for index in table.indexes:
            str(CreateIndex(index).compile(dialect=postgresql.dialect()))
    assert {"articles", "sources", "keywords", "reports", "users", "ingestion_runs", "article_keyword_hits", "seen_items"} <= set(ddl)
    assert "GENERATED ALWAYS AS" in ddl["articles"]
    assert "url_hash" in ddl["articles"] and "UNIQUE" in ddl["articles"]
