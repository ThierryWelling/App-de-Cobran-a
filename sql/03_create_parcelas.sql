-- Tabela de parcelas
create table parcelas (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  cliente_id uuid not null references clientes(id),
  numero_parcela integer not null,
  valor decimal(10,2) not null,
  data_vencimento date not null,
  status status_parcela default 'pendente' not null,
  data_pagamento date
);

-- Criar políticas de segurança para parcelas
alter table parcelas enable row level security;

create policy "Usuários podem ver parcelas de seus clientes"
  on parcelas for select
  using (cliente_id in (
    select id from clientes where user_id = auth.uid()
  ));

create policy "Usuários podem inserir parcelas para seus clientes"
  on parcelas for insert
  with check (cliente_id in (
    select id from clientes where user_id = auth.uid()
  )); 