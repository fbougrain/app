-- Script de données de test
-- Exécuter après create-database.sql

-- Insérer des utilisateurs de test
INSERT INTO users (id, name, email, password) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Alice Dupont', 'alice@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK'), -- password: password123
    ('550e8400-e29b-41d4-a716-446655440002', 'Bob Martin', 'bob@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK'), -- password: password123
    ('550e8400-e29b-41d4-a716-446655440003', 'Claire Moreau', 'claire@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK') -- password: password123
ON CONFLICT (email) DO NOTHING;

-- Insérer des notes de test
INSERT INTO notes (id, title, content, tags, status, author_id, author_name, public_token) VALUES 
    (
        '660e8400-e29b-41d4-a716-446655440001',
        'Guide de démarrage React',
        '# Guide de démarrage React

## Installation
```bash
npx create-react-app mon-app
cd mon-app
npm start
