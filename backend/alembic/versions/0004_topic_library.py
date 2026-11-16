"""topic library: topics table, keyword scope/topic, article topic

Revision ID: 0004
Revises: 0003
"""
from alembic import op

from app.models import Base

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # creates `topics` on an existing database; on a fresh one 0001 already built everything from the models
    Base.metadata.create_all(bind=op.get_bind())
    op.execute("ALTER TABLE keywords ADD COLUMN IF NOT EXISTS scope varchar(16)")
    op.execute("ALTER TABLE keywords ADD COLUMN IF NOT EXISTS topic_id integer REFERENCES topics(id)")
    op.execute("ALTER TABLE articles ADD COLUMN IF NOT EXISTS topic_id integer REFERENCES topics(id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_articles_topic ON articles (topic_id)")


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_articles_topic")
    op.execute("ALTER TABLE articles DROP COLUMN IF EXISTS topic_id")
    op.execute("ALTER TABLE keywords DROP COLUMN IF EXISTS topic_id, DROP COLUMN IF EXISTS scope")
    op.execute("DROP TABLE IF EXISTS topics")
