<?php
namespace App\Model;

use Nette;

final class ApiFacade
{
	public function __construct(
		private Nette\Database\Explorer $database,
	) {
	}

	// get data from database
    public function getApiData(string $table, string $date = null)
	{
		$rows = '';
		if ($table == 'substitutes' || $table == 'addons') {
			$rows = $this->database
            	->table($table)
            	->where('date = ?', $date)
            	->fetchAll();
		} else {
			$rows = $this->database
            	->table($table)
            	->fetchAll();
		}
		
		$data = [];
		foreach ($rows as $row) {
			$data[] = $row->toArray();
		}

        return $data;
	}

	// set data in database
	public function setApiData(string $table, $payload)
	{
		$action = $payload['action'];

		// delete old data
		$date = date('Y-m-d', mktime(0, 0, 0, date('m'), date('d') - 3, date('Y')));
		$this->database
			->table('substitutes')
			->where('date < ?', $date)
			->delete();
		$this->database
			->table('addons')
			->where('date < ?', $date)
			->delete();

		if ($action == 'create') {
			// create new data
			$data = $payload['value'];
			
			$this->database
				->table($table)
				->insert($data);
		} else if ($action == 'edit') {
			// edit data
			$data = $payload['value'];
        	$id = $payload['id'];

			$oldData = $this->database
				->table($table)
				->get($id);
			$oldData->update($data);
		} else {
			// delete data
			$id = $payload['id'];

			$this->database
				->table($table)
				->get($id)
				->delete();
		}
	}
}