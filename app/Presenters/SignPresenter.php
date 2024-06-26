<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;
use Nette\Application\UI\Form;


final class SignPresenter extends Nette\Application\UI\Presenter
{
    // sign in form
	protected function createComponentSignInForm(): Form
	{
		$form = new Form;

		$form->addText('username', 'Uživatel')
			->setRequired('Prosím vyplňte své uživatelské jméno');

		$form->addPassword('password', 'Heslo')
            ->setRequired('Prosím vyplňte své heslo');

		$form->addSubmit('send', 'Přihlásit');

		$form->onSuccess[] = $this->signInFormSucceeded(...);

		return $form;
	}

    // on form submit
	private function signInFormSucceeded(Form $form, \stdClass $data): void
    {
        try {
            $this->getUser()->login($data->username, $data->password);
            $this->redirect('Home:');

        } catch (Nette\Security\AuthenticationException $e) {
            $form->addError('Nesprávné přihlašovací jméno nebo heslo.');
        }
    }

    // sign out
    public function actionOut(): void
    {
        $this->getUser()->logout();
        $this->redirect('Home:');
    }
}