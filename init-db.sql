create table users (
	id uuid primary key,
	email varchar(255) unique not null,
	streaming_platform_refresh_token varchar(255) not null,
    streaming_platform_id varchar(255) unique not null,
	created_at timestamp default current_timestamp
);

create table configurations (
	id uuid primary key,
	user_id uuid not null,
	streaming_platform_playlist_id varchar(255) not null,
	music_database_artist_id varchar(255) not null,
	created_at timestamp default current_timestamp,
	next_sync_runs_at timestamp,
	constraint fk_user foreign key(user_id) references users(id) on delete cascade
);

create table synchronizations (
	id uuid primary key,
	configuration_id uuid not null,
	started_at timestamp not null,
	ended_at timestamp not null,
	streaming_platform_tracks_ids json not null,
	constraint fk_configuration foreign key(configuration_id) references configurations(id) on delete set null
);

