		
		document.addEventListener("deviceready", onDeviceReady, false); // PRIMEIRA FUNÇÃO A SER CHAMADA
		
        var currentRow;

        function populateDB(tx) { // CRIA UMA TABELA DEMO CASO A MESMA NÃO ESTEJA CRIADA
            tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id INTEGER PRIMARY KEY AUTOINCREMENT, name,number)');
        }

        function queryDB(tx) { // EXECUTA A OPERAÇÃO DE SELEÇÃO DA TABELA
            tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB); 
        }

        function searchQueryDB(tx) { // EXECUTA A OPERAÇÃO DE SELEÇÃO A PARTIR DO NOME DA DISCIPLINA
            tx.executeSql("SELECT * FROM DEMO where name like ('%"+ document.getElementById("txtName").value + "%')",
                    [], querySuccess, errorCB);
        }

        function querySuccess(tx, results) { // FUNÇÃO PARA A IMPRESSÃO NA TELA DAS TAREFAS RELACIONADAS AS DISCIPLINAS
            // var tblText='<table class="bordered centered"><tr><th>ID</th> <th>Disciplina</th> <th>Tarefa</th></tr>';
			var tblText='<table class="bordered"><tr><th>Disciplina</th> <th>Tarefa</th></tr>'; // PRINTA O CABEÇALHO DA TABELA
            var len = results.rows.length;
            for (var i = 0; i < len; i++) { // FOR DE IMPRESSÃO DAS LINHAS
                var tmpArgs=results.rows.item(i).id + ",'" + results.rows.item(i).name
                        + "','" + results.rows.item(i).number+"'";
                // tblText +='<tr onclick="goPopup('+ tmpArgs + ');"><td>' + results.rows.item(i).id +'</td><td>'
				   tblText +='<tr onclick="goPopup('+ tmpArgs + ');"><td>'  
                        + results.rows.item(i).name +'</td><td>' + results.rows.item(i).number +'</td></tr>'; // PRINTA A LINHA
            }
            tblText +="</table>";
            document.getElementById("tblDiv").innerHTML =tblText;
        }

        function deleteRow(tx) { // EXECUTA A OPERAÇÃO DE DELETAR DE ACORDO COM O ID DA LINHA
          tx.executeSql('DELETE FROM DEMO WHERE id = ' + currentRow, [], queryDB, errorCB);
        }


        function errorCB(err) { // CASO HAJA ERRO DE PROCESSAMENTO DE SQL, SERÁ EMITIDO UM ALERTA
            alert("Error processing SQL: "+err.code);
        }


        function successCB() { // FUNÇÃO QUE VAI ATÉ A FUNÇÃO DE SELEÇÃO DA TABELA
            var db = window.sqlitePlugin.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(queryDB, errorCB);
        }

        function onDeviceReady() { // FUNÇÃO PARA A CRIAÇÃO DA TABELA CASO A MESMA NÃO ESTEJA CRIADA
            var db = window.sqlitePlugin.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(populateDB, errorCB, successCB);
        }

        function insertDB(tx) { // EXECUTA A OPERAÇÃO DE INSERÇÃO COM OS VALORES DE ACORDO COM AS IDS DOS INPUTS DO HTML
            tx.executeSql('INSERT INTO DEMO (name,number) VALUES ("' +document.getElementById("txtName").value
                    +'","'+document.getElementById("txtNumber").value+'")');	
        }

        function goInsert() { // FUNÇÃO DE INSERÇÃO, FAZ A VERIFICAÇÃO DOS CAMPOS E CASO ESTEJAM DE ACORDO LEVA PARA A FUNÇÃO INSERTDB
			if(document.getElementById("txtName").value.length<1 && document.getElementById("txtNumber").value.length<1){
				alert("Campos Vazios!");
				successCB();
			}
			else if(document.getElementById("txtName").value.length<1){
				alert("Campo Disciplina Vazio!");
				successCB();
			}
			else if(document.getElementById("txtNumber").value.length<1){
				alert("Campo Tarefa Vazio!");
				successCB();
			}
			else{ // CASO ESTEJA TUDO DE ACORDO
				var db = window.sqlitePlugin.openDatabase("Database", "1.0", "Cordova Demo", 200000);
				db.transaction(insertDB, errorCB, successCB);
				alert("Inserido com Sucesso!");	
			}
        }

        function goSearch() { // FUNÇÃO VAI ATÉ A FUNÇÃO DE SELEÇÃO DA TABELA DO ELEMENTO
            var db = window.sqlitePlugin.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(searchQueryDB, errorCB);
        }

        function goDelete() { // FUNÇÃO QUE LEVA PARA A FUNÇÃO DELETEROW, DELETANDO ASSIM A LINHA DESEJADA
             var db = window.sqlitePlugin.openDatabase("Database", "1.0", "Cordova Demo", 200000);
             db.transaction(deleteRow, errorCB);
			document.getElementById("qrpopup").style.display="none";
			document.getElementById("formulario").style.display="block";
			document.getElementById("botoes").style.display="block";
			document.getElementById("tabela").style.display="block";
			alert("Deletado com Sucesso!");	
        }
		
		function goNoHide(){ // FUNÇÃO QUE DESABILITA O FORMULÁRIO DE EDIÇÃO E HABILITA O RESTO DO HTML
			document.getElementById("qrpopup").style.display="none";
			document.getElementById("formulario").style.display="block";
			document.getElementById("botoes").style.display="block";
			document.getElementById("tabela").style.display="block";
		}
		
        function goPopup(row,rowname,rownum) { // FUNÇÃO QUE DESABILITA A TABELA E O FORMULÁRIO DE INSERÇÃO, TRAZ JUNTO A LINHA ESCOLHIDA
            currentRow=row;
            document.getElementById("qrpopup").style.display="block";
			document.getElementById("formulario").style.display="none";
			document.getElementById("botoes").style.display="none";
			document.getElementById("tabela").style.display="none";
            document.getElementById("editNameBox").value = rowname;
            document.getElementById("editNumberBox").value = rownum;
        }

        function editRow(tx) { // FUNÇÃO DE ATUALIZAÇÃO DA LINHA
            tx.executeSql('UPDATE DEMO SET name ="'+document.getElementById("editNameBox").value+
                    '", number= "'+document.getElementById("editNumberBox").value+ '" WHERE id = '
                    + currentRow, [], queryDB, errorCB);
        }
        function goEdit() { // FUNÇÃO QUE FAZ A VERIFICAÇÃO DOS CAMPOS DO FORMULÁRIO E CASO ESTEJA DE ACORDO LEVA PARA A FUNÇÃO EDITROW
			if(document.getElementById("editNameBox").value.length<1 && document.getElementById("editNumberBox").value.length<1){
				alert("Campos Vazios!");
				successCB();
			}
			else if(document.getElementById("editNameBox").value.length<1){
				alert("Campo Disciplina Vazio!");
				successCB();
			}
			else if(document.getElementById("editNumberBox").value.length<1){
				alert("Campo Tarefa Vazio!");
				successCB();
			}
			else{ // CASO ESTEJA TUDO DE ACORDO
				var db = window.sqlitePlugin.openDatabase("Database", "1.0", "Cordova Demo", 200000);
				db.transaction(editRow, errorCB);
				document.getElementById("qrpopup").style.display="none";
				document.getElementById("formulario").style.display="block";
				document.getElementById("botoes").style.display="block";
				document.getElementById("tabela").style.display="block";
				alert("Editado com Sucesso!");	
			}
        }


