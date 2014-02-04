<?php App::uses('Debugger', 'Utility'); ?>

<h2>Conference forms</h2>

<section id="mainContainer"></section>

<div id="forms-content"></div>

<script type="text/javascript">var config = <?php echo $formsConfig; ?></script>
<?php echo $this->Html->script('cforms/models.js'); ?>
<?php echo $this->Html->script('cforms/views.js'); ?>
<?php echo $this->Html->script('cforms/main.js'); ?>
