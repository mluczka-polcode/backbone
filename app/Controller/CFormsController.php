<?php

App::uses('AppController', 'Controller');

class CFormsController extends AppController {

    public $helpers = array('Html', 'Form');

    public function index()
    {
        $this->set('forms', $this->CForm->find('all'));
    }

    public function view($id = null)
    {
        if(!$id)
        {
            throw new NotFoundException(__('Invalid form'));
        }

        $form = $this->CForm->findById($id);
        if(!$form)
        {
            throw new NotFoundException(__('Invalid form'));
        }

        $this->set('form', $form);
    }
}
