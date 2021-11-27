<?php
namespace Api\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * UserBusinesses Model
 *
 * @property \Api\Model\Table\CoreUsersTable&\Cake\ORM\Association\BelongsTo $CoreUsers
 *
 * @method \Api\Model\Entity\UserBusiness get($primaryKey, $options = [])
 * @method \Api\Model\Entity\UserBusiness newEntity($data = null, array $options = [])
 * @method \Api\Model\Entity\UserBusiness[] newEntities(array $data, array $options = [])
 * @method \Api\Model\Entity\UserBusiness|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \Api\Model\Entity\UserBusiness saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \Api\Model\Entity\UserBusiness patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \Api\Model\Entity\UserBusiness[] patchEntities($entities, array $data, array $options = [])
 * @method \Api\Model\Entity\UserBusiness findOrCreate($search, callable $callback = null, $options = [])
 *
 * @mixin \Cake\ORM\Behavior\TimestampBehavior
 */
class UserBusinessesTable extends Table
{
    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->setTable('user_businesses');
        $this->setDisplayField('name');
        $this->setPrimaryKey('id');

        $this->addBehavior('Timestamp');

        $this->belongsTo('CoreUsers', [
            'foreignKey' => 'core_user_id',
            'className' => 'Api.CoreUsers',
        ]);
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator)
    {
        $validator
            ->integer('id')
            ->allowEmptyString('id', null, 'create');

        $validator
            ->scalar('name')
            ->maxLength('name', 255)
            ->allowEmptyString('name');

        $validator
            ->scalar('cnic')
            ->maxLength('cnic', 255)
            ->allowEmptyString('cnic');

        return $validator;
    }

    /**
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules)
    {
        $rules->add($rules->existsIn(['core_user_id'], 'CoreUsers'));

        return $rules;
    }
}
