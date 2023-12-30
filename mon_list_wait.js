var DriverManager = Java.type("java.sql.DriverManager");
var ScriptExecutor  = Java.type("oracle.dbtools.raptor.newscriptrunner.ScriptExecutor");

var BGsql="";
for(var i=1;i<args.length;i++){
  BGsql = BGsql + " " + args[i];
}

var jdbc = conn.getMetaData().getURL();
var user = 'system';
var pass = 'qwerty68';

//var conn = require("");

runme(BGsql);

function main(arg){
	function inner(){
		var conn2  = DriverManager.getConnection(jdbc,user,pass);		
		var sqlcl2 = new ScriptExecutor(conn2);		
		
		sqlcl2.setStmt(arg);
		sqlcl2.run();
		conn2.close();
	}
	return inner;
};

function runme(arg){
	var Thread = Java.type("java.lang.Thread");
	var Runnable = Java.type("java.lang.Runnable");

	this.thread = new Thread(new Runnable() {
	  	run: main(arg)
	});

	this.thread.start();
return;
}