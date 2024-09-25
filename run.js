const Holidays = require('date-holidays');
const hd = new Holidays('CN'); // 传入国家代码 'CN' 代表中国

function isWorkday() {
  const today = new Date();
  
  // 检查是否为法定假日或周末
  const isHoliday = hd.isHoliday(today);
  const day = today.getDay();

  // 如果是法定假日，或者是周六/周日，返回 false
  if (isHoliday || day === 0 || day === 6) {
    return false;
  }

  return true;
}

// 执行判断
if (isWorkday()) {
  console.log("今天是工作日");
} else {
  console.log("今天不是工作日");
}