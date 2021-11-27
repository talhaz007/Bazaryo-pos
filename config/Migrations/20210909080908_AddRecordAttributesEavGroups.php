<?php
use Migrations\AbstractMigration;

class AddRecordAttributesEavGroups extends AbstractMigration
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
        $core_product_eav_attribute_groups = [
            [
                
                'code' => 'default', 
                'name' => "Default",
                'render_template' => "",
                'sort_order' => 0,

            ]
        ];
        if ($this->hasTable('core_product_eav_attribute_groups')) {
            $this->table('core_product_eav_attribute_groups')->insert($core_product_eav_attribute_groups)->save();
        }
    }
}
