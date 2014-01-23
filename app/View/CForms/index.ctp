<?php App::uses('Debugger', 'Utility'); ?>

<h2>Conference forms</h2>

<section id="mainContainer"></section>

<div id="forms-content"></div>

<script type="text/javascript">var formsList = <?php echo json_encode($forms); ?>;</script>

<script src="/js/jquery-2.0.3.min.js"></script>
<script src="/js/jquery.serializeJSON.min.js"></script>
<script src="/js/underscore-min.js"></script>
<script src="/js/backbone-min.js"></script>
<script src="/js/require.js"></script>
<script src="/js/main.js"></script>
