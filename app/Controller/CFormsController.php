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

    public function edit($id = null)
    {
        if($this->request->is('post') && $this->CForm->save($this->request->data))
        {
            $this->Session->setFlash('Form has been saved.');
            return $this->redirect('/');
        }

        $this->set('form', $this->CForm->findById($id));
    }

    public function api($id = 0)
    {
        $this->autoRender = false;

//         if(!$this->request->is('ajax'))
//         {
//             die('AJAX only!');
//         }

//         if($_SERVER['REQUEST_METHOD'] == 'PUT')
//         {
//             $data = '';
//             $putdata = fopen('php://input', 'r');
//             while($string = fread($putdata, 1024))
//             {
//                 $data .= $string;
//             }
//         }

        if ($this->request->is('post'))
        {
            // hack ;-)
            $this->request->data['data'] = $this->request->data[0];

//             echo '<pre>'.print_r($this->request->data, true).'</pre>';
            if ($this->CForm->save($this->request->data))
            {
                echo '{}';
            }
            else
            {
                debug($this->Recipe->validationErrors);
                echo '{"error":"..."}';
            }
            return;
        }

        if($id)
        {
            $out = $this->CForm->find('first', array('id' => $id));
            $out = $out['CForm'];
            $out['data'] = json_decode($out['data']);
        }
        else
        {
            $out = array();
            $forms = $this->CForm->find('all');
            foreach($forms as $form)
            {
                $data = json_decode($form['CForm']['data']);
                $out[] = array(
                    'id' => $form['CForm']['id'],
                    'name' => $data->firstName . ' ' . $data->lastName,
                    'data' => $data,
                );
            }
        }

        header('Content-Type: application/json; charset=utf8');
        echo json_encode($out);
    }

//     public $components = array('RequestHandler');
//
//     public function index() {
//         $cforms = $this->CForm->find('all');
//         $this->set(array(
//             'cforms' => $cforms,
//             '_serialize' => array('cforms')
//         ));
//     }
//
//     public function view($id) {
//         $cform = $this->CForm->findById($id);
//         $this->set(array(
//             'cform' => $cform,
//             '_serialize' => array('cform')
//         ));
//     }
//
//     public function edit($id) {
//         $this->CForm->id = $id;
//         if ($this->CForm->save($this->request->data)) {
//             $message = 'Saved';
//         } else {
//             $message = 'Error';
//         }
//         $this->set(array(
//             'message' => $message,
//             '_serialize' => array('message')
//         ));
//     }
//
//     public function delete($id) {
//         if ($this->CForm->delete($id)) {
//             $message = 'Deleted';
//         } else {
//             $message = 'Error';
//         }
//         $this->set(array(
//             'message' => $message,
//             '_serialize' => array('message')
//         ));
//     }
}
