-- Função para atualizar status de parcelas atrasadas
create or replace function atualizar_status_parcelas_atrasadas()
returns void as $$
begin
  update parcelas
  set status = 'atrasada'
  where status = 'pendente'
  and data_vencimento < current_date;
end;
$$ language plpgsql;

-- Criar o trigger na tabela de parcelas
drop trigger if exists trigger_parcelas_atrasadas on parcelas;
create trigger trigger_parcelas_atrasadas
  after insert or update on parcelas
  for each statement
  execute function atualizar_status_parcelas_atrasadas();

-- Função para criar parcelas automaticamente
create or replace function criar_parcelas_cliente()
returns trigger as $$
declare
  i integer;
  valor_parcela decimal(10,2);
begin
  valor_parcela := NEW.valor_total / NEW.total_parcelas;
  
  for i in 1..NEW.total_parcelas loop
    insert into parcelas (
      cliente_id,
      numero_parcela,
      valor,
      data_vencimento
    ) values (
      NEW.id,
      i,
      valor_parcela,
      NEW.data_vencimento + ((i-1) * interval '1 month')
    );
  end loop;
  
  return NEW;
end;
$$ language plpgsql;

-- Criar o trigger para criar parcelas automaticamente
create trigger trigger_criar_parcelas
  after insert on clientes
  for each row
  execute function criar_parcelas_cliente(); 