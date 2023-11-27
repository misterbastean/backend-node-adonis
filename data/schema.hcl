schema "bench_dashboard" {}

table "user" {
  schema = schema.bench_dashboard
  column "id" {
    type = text
  }
  column "user_name" {
    type = text
  }
  column "first_name" {
    type = text
  }
  column "last_name" {
    type = text
  }
  column "email" {
    type = text
  }
  column "password" {
    type = text
  }
  column "created_at" {
    type = datetime
  }
  column "updated_at" {
    type = datetime
  }
  column "deleted_at" {
    type = datetime
    null = true
  }
  primary_key {
    columns = [
      column.id
    ]
  }
  index "user_name_idx" {
    columns = [
      column.user_name
    ]
    unique = true
  }
  index "user_email_idx" {
    columns = [
      column.email
    ]
    unique = true
  }
  index "user_created_at_idx" {
    columns = [
      column.created_at
    ]
  }
  index "user_updated_at_idx" {
    columns = [
      column.updated_at
    ]
  }
  index "user_deleted_at_idx" {
    columns = [
      column.deleted_at
    ]
  }
}

table "account" {
  schema = schema.bench_dashboard
  column "id" {
    type = text
  }
  column "user_id" {
    type = text
  }
  column "category_id" {
    type = text
  }
  column "name" {
    type = text
  }
  column "amount" {
    type = real
  }
  column "available_amount" {
    type = real
  }
  column "account_number" {
    type = text
  }
  column "routing_number" {
    type = integer
  }
  column "currency_code" {
    type = text
  }
  column "created_at" {
    type = datetime
  }
  column "updated_at" {
    type = datetime
  }
  column "deleted_at" {
    type = datetime
    null = true
  }
  primary_key {
    columns = [
      column.id
    ]
  }
  foreign_key "account_user_fk" {
    columns = [column.user_id]
    ref_columns = [table.user.column.id]
    on_delete = CASCADE
    on_update = NO_ACTION
  }
  foreign_key "account_category_fk" {
    columns = [column.category_id]
    ref_columns = [table.category.column.id]
    on_delete = CASCADE
    on_update = NO_ACTION
  }
  index "account_number_idx" {
    columns = [
      column.account_number
    ]
    unique = true
  }
  index "account_routing_number_idx" {
    columns = [
      column.routing_number
    ]
  }
  index "account_created_at_idx" {
    columns = [
      column.created_at
    ]
  }
  index "account_updated_at_idx" {
    columns = [
      column.updated_at
    ]
  }
  index "account_deleted_at_idx" {
    columns = [
      column.deleted_at
    ]
  }
}

table "transaction" {
  schema = schema.bench_dashboard
  column "id" {
    type = text
  }
  column "user_id" {
    type = text
  }
  column "account_id" {
    type = text
  }
  column "category_id" {
    type = text
  }
  column "amount" {
    type = real
  }
  column "status" {
    type = text
  }
  column "merchant_name" {
    type = text
  }
  column "created_at" {
    type = datetime
  }
  column "updated_at" {
    type = datetime
  }
  column "deleted_at" {
    type = datetime
    null = true
  }
  primary_key {
    columns = [
      column.id
    ]
  }
  foreign_key "transaction_user_fk" {
    columns = [column.user_id]
    ref_columns = [table.user.column.id]
    on_delete = CASCADE
    on_update = NO_ACTION
  }
  foreign_key "transaction_account_fk" {
    columns = [column.account_id]
    ref_columns = [table.account.column.id]
    on_delete = CASCADE
    on_update = NO_ACTION
  }
  foreign_key "transaction_category_fk" {
    columns = [column.category_id]
    ref_columns = [table.category.column.id]
    on_delete = CASCADE
    on_update = NO_ACTION
  }
  index "transaction_status_idx" {
    columns = [
      column.status
    ]
  }
  index "transaction_merchant_name_idx" {
    columns = [
      column.merchant_name
    ]
  }
  index "transaction_created_at_idx" {
    columns = [
      column.created_at
    ]
  }
  index "transaction_updated_at_idx" {
    columns = [
      column.updated_at
    ]
  }
  index "transaction_deleted_at_idx" {
    columns = [
      column.deleted_at
    ]
  }
}

table "category" {
  schema = schema.bench_dashboard
  column "id" {
    type = text
  }
  column "name" {
    type = text
  }
  column "type" { // account, transaction
    type = text
  }
  column "created_at" {
    type = datetime
  }
  column "updated_at" {
    type = datetime
  }
  column "deleted_at" {
    type = datetime
    null = true
  }
  primary_key {
    columns = [
      column.id
    ]
  }
  index "category_name_idx" {
    columns = [
      column.name
    ]
  }
  index "category_type_idx" {
    columns = [
      column.type
    ]
  }
  index "category_created_at_idx" {
    columns = [
      column.created_at
    ]
  }
  index "category_updated_at_idx" {
    columns = [
      column.updated_at
    ]
  }
  index "category_deleted_at_idx" {
    columns = [
      column.deleted_at
    ]
  }
}
