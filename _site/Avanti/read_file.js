<script src="./papaparse.min.js"></script>
<script src="./jquery-3.3.1.min.js"></script>
<script>
  var data;
 
  function handleFileSelect(evt) {
    var file = evt.target.files[0];
 
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: function(results) {
        data = results;
      }
    });
  }
 
  $(document).ready(function(){
    $("#csv-file").change(handleFileSelect);
  });
</script>
<input type="file" id="csv-file" name="BP_2017_coal_consumption_mtoe.csv"/>