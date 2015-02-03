//paging demo
var data = "白月光心里某个地方那么亮却那么冰凉每个人都有一段悲伤想隐藏却欲盖弥彰白月光照天涯的两端在心上却不在身旁擦不干你当时的泪光路太长追不回原谅你是我不能言说的伤想遗忘又忍不住回想像流亡一路跌跌撞撞你的捆绑无法释放白月光照天涯的两端越圆满越觉得孤单擦不干回忆里的泪光路太长怎么补偿".split("");

//页码从0开始，5实际是6,与下面的写法等价
//$.paging(136, createTable, $('#page')[0], {btnNum: 8}).fillPageIdx(5);
var lyricTable = $.paging(136, createTable, $('#pagebtns')[0], {btnNum: 8, pageIdx:5});

function createTable(start, end) {
	var tableStr = "<table>";
	for(var i = start; i < end; i++) {
		tableStr += "<tr><td>" + i + "</td><td>" + data[i] + "</td></tr>";
	}
	tableStr += "</table>";
	$('#tableLocation').html(tableStr);
}
$('#page-count').on('change', function() {
	lyricTable.defaults.pageRows = this.value;
	lyricTable.defaults.pageIdx = 0;
	lyricTable.doPaging();
})