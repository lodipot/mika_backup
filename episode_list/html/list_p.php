<!DOCTYPE html>
<html>
	<head></head>
	<body>
		
		<script>
			function Request(){
				var requestParam = "";
				this.getParameter = function(param){
					var url = unescape(location.href);
					var paramArr = (url.substring(url.indexOf("?")+1, url.length)).split("&");
					for(var i = 0; i < paramArr.length; i++){
						var temp = paramArr[i].split("=");
						if(temp[0].toUpperCase() == param.toUpperCase()){
							requestParam = paramArr[i].split("=")[1];
							break;
						}
					}
					return requestParam;
				};
			}
			var request = new Request();
			function page_shifter() {
				var base_address = 'https://lodipot.github.io/mika_backup/episode_list/html/list_normal_p';
				var page_now = 1;
				
				if (request.getParameter("next") == "1"){
					page_next = page_now + 1;
				}
				else if (request.getParameter("back") == "1"){
					page_back = page_now - 1;
				}
				else if (request.getParameter("first") == "1"){
					page_next = 1;
				}
				else if (request.getParameter("last") == "1"){
					page_next = 5;
				}
				else{
					page_next = request.getParameter("target_page_num");
				}
				n_page = base_address + page_next + ".html";
				
				return n_page
			}
			location.href = page_shifter();
		</script>
	</body>
</html>
