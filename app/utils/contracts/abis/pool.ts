export const PoolABI = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint8',
            name: 'realDecimal',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'commonDecimal',
            type: 'uint8',
          },
          {
            internalType: 'uint16',
            name: 'fee',
            type: 'uint16',
          },
          {
            internalType: 'uint32',
            name: 'poolId',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'anchor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'deployer',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeLibrary',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'router',
            type: 'address',
          },
        ],
        internalType: 'struct IPoolStructs.CreatePoolParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'EXCCEED_SWAP_LIMIT',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INSUFFICIENT_FEE',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INSUFFICIENT_LIQUIDITY',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INSUFFICIENT_POSITION',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INVALID_INDICATOR',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NATIVE_TRANSFER_FAILED',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'wrongAnchor',
        type: 'address',
      },
    ],
    name: 'NOT_ANCHOR',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NO_PERMISSION',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NULL_ADDRESS',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ONLY_ROUTER',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZERO_AMOUNT',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousFeeReceiver',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'add ress',
        name: 'newFeeReceiver',
        type: 'address',
      },
    ],
    name: 'FeeReceiverUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnerUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'indicator',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'srcChainId',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
    ],
    name: 'RemoveLiquidityFromRemote',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'previousLimit',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newLimit',
        type: 'uint256',
      },
    ],
    name: 'SwapLimitUpdated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'PURE_MESSAGE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'REMOTE_REMOVE_LIQUIDITY',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'REMOTE_SWAP_OUT',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VERSION',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'anchor',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'collectLPFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'conversionRatio',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cumulatedFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'lpAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'decreaseLiquidity',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'dstChainId',
        type: 'uint32',
      },
      {
        internalType: 'address',
        name: 'lpAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: 'recipient',
        type: 'bytes32',
      },
      {
        internalType: 'address payable',
        name: 'refundAddress',
        type: 'address',
      },
    ],
    name: 'decreaseLiquidityRemote',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeRatio',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeReceiver',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'lp',
        type: 'address',
      },
    ],
    name: 'getPosition',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'lpAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'increaseLiquidity',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'liquidity',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolId',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'txUniqueIdentification',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'payload',
        type: 'bytes',
      },
    ],
    name: 'receiveFromAnchor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'router',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newReceiver',
        type: 'address',
      },
    ],
    name: 'setReceiver',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newLimit',
        type: 'uint256',
      },
    ],
    name: 'setSwapLimit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint32',
            name: 'dstChainId',
            type: 'uint32',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'recipient',
            type: 'bytes32',
          },
          {
            internalType: 'address payable',
            name: 'refundAddress',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'consumerData',
            type: 'bytes',
          },
        ],
        internalType: 'struct IPoolStructs.SwapInData',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'swapIn',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'crossId',
        type: 'bytes32',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'swapLimit',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
