<?php
namespace App\Model;

use Nette;

final class ApiFacade
{
	public function __construct(
		private Nette\Database\Explorer $database,
	) {
	}

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

	public function setApiData(string $table, $payload)
	{
		$action = $payload['action'];

		if ($action == 'create') {
			$data = $payload['value'];
			
			$this->database
				->table($table)
				->insert($data);
		} else if ($action == 'edit') {
			$data = $payload['value'];
        	$id = $payload['id'];

			$oldData = $this->database
				->table($table)
				->get($id);
			$oldData->update($data);
		} else {
			$id = $payload['id'];

			$this->database
				->table($table)
				->get($id)
				->delete();
		}
	}
}