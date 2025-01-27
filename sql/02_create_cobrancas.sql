-- Criar tabela de cobranças
create table public.cobrancas (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  cliente_id uuid not null references public.clientes(id),
  valor decimal(10,2) not null,
  status text not null check (status in ('pendente', 'pago', 'vencido')),
  data_vencimento date not null,
  descricao text not null
);

-- Criar políticas de segurança para cobranças
alter table public.cobrancas enable row level security;

create policy "Usuários podem ver cobranças de seus clientes"
  on public.cobrancas for select
  using (cliente_id in (
    select id from public.clientes where user_id = auth.uid()
  ));

create policy "Usuários podem inserir cobranças para seus clientes"
  on public.cobrancas for insert
  with check (cliente_id in (
    select id from public.clientes where user_id = auth.uid()
  )); 