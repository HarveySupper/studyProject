function isValidId(input: string): boolean {
  const regex = /^[1-9]\d{5,10}$/;
  return regex.test(input);
}
const 最小 = 100000
const 最大 = 999999999

let 是否有效 = true
let 循环次数 = 100000
let 最终值 = 0
let 随机次数 = 0
do {
    const num = 最小 + Math.ceil(Math.random() * (最大 - 最小))
    最终值 = num
    是否有效 = isValidId(num.toString())
    随机次数++
} while (是否有效 && 随机次数 < 循环次数);

console.log(`一共随机了${随机次数}次,最后一次随机数${最终值},结果为:${是否有效}`)
