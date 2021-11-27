<?php
use Migrations\AbstractMigration;

class AddAttributes extends AbstractMigration
{
    /**
     * Change Method.
     *
     * More information on this method is available here:
     * https://book.cakephp.org/phinx/0/en/migrations.html#the-change-method
     * @return void
     */
    public function change()
    {
        $attributes = [
            [
                'core_account_id' => 1,
                'code' => 'title', 
                'name' => "Name",
                'data_type' => "varchar",
            ],
            [
                'core_account_id' => 1,
                'code' => 'description', 
                'name' => "Description",
                'data_type' => "varchar",
            ],
            [
                'core_account_id' => 1,
                'code' => 'barcode', 
                'name' => "Barcode",
                'data_type' => "varchar",
            ],
            [
                'core_account_id' => 1,
                'code' => 'price', 
                'name' => "Price",
                'data_type' => "int",
            ],
            [
                'core_account_id' => 1,
                'code' => 'tax', 
                'name' => "Tax",
                'data_type' => "varchar",
            ],
            [
                'core_account_id' => 1,
                'code' => 'wholesale_price', 
                'name' => "WholesalePrice",
                'data_type' => "int",
            ],
            [
                'core_account_id' => 1,
                'code' => 'quantity', 
                'name' => "Quantity",
                'data_type' => "int",
            ],
            [
                'core_account_id' => 1,
                'code' => 'is_online', 
                'name' => "IsOnline",
                'data_type' => "int",
            ]
        ];
        if ($this->hasTable('core_product_eav_attributes')) {
            $this->table('core_product_eav_attributes')->insert($attributes)->save();
        }
    }
}
