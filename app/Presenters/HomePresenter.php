<?php

declare(strict_types=1);

namespace App\Presenters;

use Nette;


final class HomePresenter extends Nette\Application\UI\Presenter
{
    public function renderDefault()
    {
        $this->template->reactRoot = 'app'; // ID of the root element for React
    }
}
