export const OrderABI = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'pair',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'order_id',
        type: 'uint256',
      },
    ],
    name: 'cancelOrderBuyB',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'pair',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'order_id',
        type: 'uint256',
      },
    ],
    name: 'cancelOrderSellB',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'pair',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'amount_u',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount_b',
        type: 'uint256',
      },
    ],
    name: 'placeOrderBuyB',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'pair',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'amount_u',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount_b',
        type: 'uint256',
      },
    ],
    name: 'placeOrderSellB',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
