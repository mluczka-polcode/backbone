<?php

App::uses('AppController', 'Controller');

class CFormsController extends AppController {

    public $helpers = array('Html', 'Form');

    public function index()
    {
        $formsSimple = array();
        $forms = $this->CForm->find('all');
        foreach($forms as $form)
        {
            $data = json_decode($form['CForm']['data']);
            $formsSimple[$form['CForm']['id']] = $data->firstName . ' ' . $data->lastName;
        }

        $this->set('forms', $formsSimple);
    }

    public function api($id = 0)
    {
        $this->autoRender = false;

        if($this->request->is('post'))
        {
            $out = $this->saveForm();
        }
        elseif($this->request->is('delete'))
        {
            $out = $this->deleteForm($id);
        }
        else
        {
            $out = $id ? $this->getForm($id) : $this->getAllForms();
        }

        header('Content-Type: application/json; charset=utf8');
        echo json_encode($out);
    }

    private function getForm($id)
    {
        $out = $this->CForm->findById($id);
        $out = $out['CForm'];
        $out['data'] = json_decode($out['data']);
        return $out;
    }

    private function getAllForms()
    {
        $out = array();

        $forms = $this->CForm->find('all');
        foreach($forms as $form)
        {
            $out[] = array(
                'id' => $form['CForm']['id'],
                'data' => json_decode($form['CForm']['data']),
            );
        }

        return $out;
    }

    private function saveForm()
    {
        // hack ;-P
        $this->request->data['data'] = $this->request->data[0];

        if($this->CForm->save($this->request->data))
        {
            return array(
                'id' => $this->CForm->id,
            );
        }

        return array(
            'error' => $this->CForm->validationErrors,
        );
    }

    private function deleteForm($id)
    {
        $result = array();

        if($this->CForm->delete($id))
        {
            $result['deleted'] = 1;
        }
        else
        {
            $result['error'] = 1;
        }

        return $result;
    }

}
