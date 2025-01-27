-- Criar tabela de clientes
create table public.clientes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nome text not null,
  email text not null,
  telefone text not null,
  cpf_cnpj text not null,
  endereco text not null,
  user_id uuid not null references auth.users(id)
);

-- Criar políticas de segurança para clientes
alter table public.clientes enable row level security;

create policy "Usuários podem ver seus próprios clientes"
  on public.clientes for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir seus próprios clientes"
  on public.clientes for insert
  with check (auth.uid() = user_id); 