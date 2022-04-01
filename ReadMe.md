#### Explanation

- Please run npm install commant to install the dependencies
- We just have to call getBalanceSheet() by passing it the JSON object with all the data mentioned.
- Apart from that I jave added a functionality where we can read input from a file present in the same directory level where script.js file is present.
- To read file just call thr readDataFromFile() with the path as string.

### Problem statement

Write a file which will take a json object containing the revenue and expense data of a company, and output its balance sheet month wise. The revenue and expense may be fixed or variable amounts payable in installments.

The program should output the answer/ balance sheet to the console. The balance for any month is the sum of all revenue for the month - sum of all expense for the month (`revenue.amount - expense.amount`). Sort the balancesheet in ascending order by timestamp.

#### Assumptions

- Amount will always be a valid positive number
- `startDate` will always be a valid ISO timestamp where the year and month may change. The day and time will remain constant
- Date entries may be missing for revenue or expense, assume the amount is 0
