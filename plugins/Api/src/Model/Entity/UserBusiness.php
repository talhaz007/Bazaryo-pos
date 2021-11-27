<?php
namespace Api\Model\Entity;

use Cake\ORM\Entity;

/**
 * UserBusiness Entity
 *
 * @property int $id
 * @property string|null $name
 * @property string|null $cnic
 * @property int|null $core_user_id
 * @property \Cake\I18n\FrozenTime $created
 * @property \Cake\I18n\FrozenTime $modified
 *
 * @property \Api\Model\Entity\CoreUser $core_user
 */
class UserBusiness extends Entity
{
    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * Note that when '*' is set to true, this allows all unspecified fields to
     * be mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove it), and explicitly make individual fields accessible as needed.
     *
     * @var array
     */
    protected $_accessible = [
        'name' => true,
        'cnic' => true,
        'core_user_id' => true,
        'created' => true,
        'modified' => true,
        'core_user' => true,
    ];
}
