function isValidId(input: string): boolean {
  const regex = /^[1-9]\d{5,10}$/;
  return regex.test(input);
}
const min = 100000
const max = 999999999

let valid = true
let count = 100000
let lastNum = 0
let index = 0
do {
    const num = min + Math.ceil(Math.random() * (max - min))
    lastNum = num
    valid = isValidId(num.toString())
    index++
} while (valid && index < count);

console.log(`一共随机了${index}次,最后一次随机数${lastNum},结果为:${valid}`)
