-- Tabela de clientes
create table clientes (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nome text not null,
  email text not null,
  telefone text not null,
  cpf_cnpj text not null,
  endereco text not null,
  foto_url text,
  data_cobranca date not null,
  data_vencimento date not null,
  total_parcelas integer not null,
  valor_total decimal(10,2) not null,
  user_id uuid not null references auth.users(id)
);

-- Criar políticas de segurança para clientes
alter table clientes enable row level security;

create policy "Usuários podem ver seus próprios clientes"
  on clientes for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir seus próprios clientes"
  on clientes for insert
  with check (auth.uid() = user_id); 