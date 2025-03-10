import { Line, Pie } from '@ant-design/charts';
import React from 'react'

function ChartComponents({ sortedTransactions }) {
    const data = sortedTransactions.map( (item) => {
        return { date: item.date, amount: item.amount };
    });
  
  const spendingData = sortedTransactions.filter(
    (transaction) => {
      if (transaction.type == "expense") {
      return {tag:transaction.tag,amount:transaction.amount}
      }}
  );
  const receiveData = sortedTransactions.filter(
    (transaction) => {
      if (transaction.type == "income") {
      return {tag:transaction.tag,amount:transaction.amount}
      }}
  );
  let finalSpending = spendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});
  let finalReceived = receiveData.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});
  const config = {
    data: data,
    autoFit: true,
    xField: 'date',
    yField: 'amount',
    point: {
      size: 5,
      shape:'circle',
    },
    label: {
      visible: true,
      style: {
        textSize: 15,
        textAlign: "left",
      },
      offset: 10,
    },
  };
  const spendingConfig = {
    data: Object.values(finalSpending),
    width: 400,
    angleField: "amount",
    colorField:"tag",
  };
  const receivingConfig = {
    data: Object.values(finalReceived),
    width: 400,
    angleField: "amount",
    colorField:"tag",
  };
  
  let chart;
  let pieChart;
  return (
    <>
      <div className='chart-analysis'>
              <h2 style={{marginTop:0}}>Your Analysis</h2>
        <Line {...config} onReady={(chartInstance) => ( chart  =chartInstance )} />
        </div>
      <div className='Charts-wrapper'>
        <div className='chart-expenses'>
            <h2 style={{marginTop:0,marginLeft:15 }}>Your Income</h2>
            <Pie {...receivingConfig} onReady={(chartInstance) => ( pieChart  =chartInstance )}/>
          </div>
          <div className='chart-expenses'>
            <h2 style={{marginTop:0,marginLeft:15 }}>Your Expenses</h2>
            <Pie {...spendingConfig} onReady={(chartInstance) => ( pieChart  =chartInstance )}/>
          </div>
      </div>
    </>
  )
}

export default ChartComponents
