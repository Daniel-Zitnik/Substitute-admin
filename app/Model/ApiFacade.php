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
}