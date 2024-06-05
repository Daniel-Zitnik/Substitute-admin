<?php

namespace App\Presenters;

use Nette\Application\UI\Presenter;
use App\Model\ApiFacade;

class ApiPresenter extends Presenter
{
    public function __construct(
		private ApiFacade $facade,
	) {

	}

    // get user log in status
    public function actionGetLoginStatus()
    {
        $isLoggedIn = $this->user->isLoggedIn();
        $this->sendJson(['isLoggedIn' => $isLoggedIn]);
    }

    // load substitute data
    public function actionGetSubstitutes()
    {
        $payload = json_decode($this->getHttpRequest()->getRawBody(), true);
        $date = $payload['value'];

        $data = $this->facade
            ->getApiData('substitutes', $date);

        $this->sendJson($data);
    }

    // load teachers
    public function actionGetTeachers()
    {
        $data = $this->facade
            ->getApiData('teachers');

        $this->sendJson($data);
    }

    // load classes
    public function actionGetClasses()
    {
        $data = $this->facade
            ->getApiData('classes');

        $this->sendJson($data);
    }

    // load addon data
    public function actionGetAddons()
    {
        $payload = json_decode($this->getHttpRequest()->getRawBody(), true);
        $date = $payload['value'];
        
        $data = $this->facade
            ->getApiData('addons', $date);

        $this->sendJson($data);
    }

    // set data
    public function actionSetSubstitute()
    {
        $this->setData('substitutes');
    }

    public function actionSetAddon()
    {
        $this->setData('addons');
    }

    public function actionSetTeacher()
    {
        $this->setData('teachers');
    }

    public function actionSetClass()
    {
        $this->setData('classes');
    }

    private function setData($table) {
        if ($this->user->isLoggedIn()) {
            // get data from frontend
            $payload = json_decode($this->getHttpRequest()->getRawBody(), true);
            // set data in database
            $this->facade->setApiData($table, $payload);
            $this->sendJson(['status' => 'success']);
        } else {
            // user not logged in
            $this->sendJson(['status' => 'user not logged in']);
        }
    }
}