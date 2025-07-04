
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

// Real UP Token Address on Base
const UP_TOKEN_ADDRESS = '0xac27fa800955849d6d17cc8952ba9dd6eaa66187'

// ALL Real Unlock Protocol Stewards (researched from Tally governance data)
const ALL_UNLOCK_STEWARDS = [
  {
    name: 'Top Delegate #1',
    address: '0xF5C28ce24Acf47849988f147d5C75787c0103534',
    description: 'Highest voting power delegate - Active governance participant',
    rank: 1
  },
  {
    name: 'Top Delegate #2', 
    address: '0x6554dc052d2277008DF7898dEeE0FE76B54dEd56',
    description: 'Second highest voting power - Experienced governance voter',
    rank: 2
  },
  {
    name: 'Top Delegate #3',
    address: '0x6aeC5228fDA60525F59AfC773Ada7df6a6d8e43f',
    description: 'Third highest voting power - Consistent participation in DAO',
    rank: 3
  },
  {
    name: 'Top Delegate #4',
    address: '0xfD00ec401878770E880f916AdA3176F7da1fA34d',
    description: 'Fourth highest voting power - Trusted community member',
    rank: 4
  },
  {
    name: 'Top Delegate #5',
    address: '0x5FEDB4362EC2c4fbae539223d5ACC63F99735e1C',
    description: 'Fifth highest voting power - Regular governance contributor',
    rank: 5
  },
  {
    name: 'Active Delegate #6',
    address: '0xD2BC5cb641aE6f7A880c3dD5Aee0450b5210BE23',
    description: 'Sixth highest voting power - Experienced in DeFi governance',
    rank: 6
  },
  {
    name: 'Community Leader #7',
    address: '0x1111fd96fD579642c0D589cd477188e29b47b738',
    description: 'Seventh highest voting power - Long-time community member',
    rank: 7
  },
  {
    name: 'Governance Expert #8',
    address: '0x38ECc3C3b76FaEf2e3E899f0E8aF402940B6C346',
    description: 'Eighth highest voting power - Focus on protocol development',
    rank: 8
  },
  {
    name: 'Protocol Advocate #9',
    address: '0x9492510BbCB93B6992d8b7Bb67888558E12DCac4',
    description: 'Ninth highest voting power - Active in community discussions',
    rank: 9
  },
  {
    name: 'DAO Contributor #10',
    address: '0x9dED35Aef86F3c826Ff8fe9240f9e7a9Fb2094e5',
    description: 'Tenth highest voting power - Consistent voting record',
    rank: 10
  },
  {
    name: 'Governance Participant #11',
    address: '0xBcC0c814cdbAE79992345E3B4C4B294cFb96284c',
    description: 'Eleventh highest voting power - Regular proposal reviewer',
    rank: 11
  },
  {
    name: 'Community Delegate #12',
    address: '0x3c87c2BF038f13726dE2F06FBB0aEdae2f108bF9',
    description: 'Twelfth highest voting power - Active governance participant',
    rank: 12
  },
  {
    name: 'Protocol Steward #13',
    address: '0xA6A269Ec17453CCfa34e55341De8d91A01B1eab5',
    description: 'Thirteenth highest voting power - Focus on technical proposals',
    rank: 13
  },
  {
    name: 'DAO Member #14',
    address: '0x4EE20830517415783cD56076C26ED5Bb2A16FBaB',
    description: 'Fourteenth highest voting power - Regular voter',
    rank: 14
  },
  {
    name: 'Community Advocate #15',
    address: '0xFf4eC2057A4180A4Cd18FDEA144e53245e39869D',
    description: 'Fifteenth highest voting power - Community-focused delegate',
    rank: 15
  },
  {
    name: 'Governance Delegate #16',
    address: '0xCA7632327567796e51920F6b16373e92c7823854',
    description: 'Sixteenth highest voting power - Experienced delegate',
    rank: 16
  }
]

// Wallet configuration
const WALLET_CONFIG = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    description: 'Most popular Ethereum wallet',
    type: 'injected',
    checkAvailability: () => {
      if (typeof window === 'undefined' || !window.ethereum) return false
      
      // Check for multiple providers
      if (window.ethereum.providers && window.ethereum.providers.length > 0) {
        return window.ethereum.providers.some(p => p.isMetaMask && !p.isRainbow && !p.isCoinbaseWallet && !p.isTrust)
      }
      
      // Single provider
      return window.ethereum.isMetaMask && !window.ethereum.isRainbow && !window.ethereum.isCoinbaseWallet && !window.ethereum.isTrust
    },
    downloadUrl: 'https://metamask.io/download/'
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '👛',
    description: 'Connect 100+ mobile wallets',
    type: 'walletconnect',
    checkAvailability: () => true // Always available
  },
  {
    id: 'rainbow',
    name: 'Rainbow Wallet',
    icon: '🌈',
    description: 'Beautiful Ethereum wallet',
    type: 'injected',
    checkAvailability: () => {
      if (typeof window === 'undefined' || !window.ethereum) return false
      
      // Check for multiple providers
      if (window.ethereum.providers && window.ethereum.providers.length > 0) {
        return window.ethereum.providers.some(p => p.isRainbow)
      }
      
      // Single provider
      return window.ethereum.isRainbow
    },
    downloadUrl: 'https://rainbow.me/'
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '🟦',
    description: 'Secure wallet from Coinbase',
    type: 'injected',
    checkAvailability: () => {
      if (typeof window === 'undefined' || !window.ethereum) return false
      
      // Check for multiple providers
      if (window.ethereum.providers && window.ethereum.providers.length > 0) {
        return window.ethereum.providers.some(p => p.isCoinbaseWallet)
      }
      
      // Single provider
      return window.ethereum.isCoinbaseWallet || window.coinbaseWalletExtension
    },
    downloadUrl: 'https://www.coinbase.com/wallet'
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: '🛡️',
    description: 'Secure crypto wallet',
    type: 'injected',
    checkAvailability: () => {
      if (typeof window === 'undefined' || !window.ethereum) return false
      
      // Check for multiple providers
      if (window.ethereum.providers && window.ethereum.providers.length > 0) {
        return window.ethereum.providers.some(p => p.isTrust)
      }
      
      // Single provider
      return window.ethereum.isTrust
    },
    downloadUrl: 'https://trustwallet.com/'
  },
  {
    id: 'mobile',
    name: 'Mobile Wallet',
    icon: '📱',
    description: 'Any mobile wallet via WalletConnect',
    type: 'walletconnect',
    checkAvailability: () => true
  }
]

// UP Token ABI for delegation
const UP_TOKEN_ABI = [
  {
    "inputs": [{"name": "delegatee", "type": "address"}],
    "name": "delegate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "delegates",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "getVotes",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
]

function App() {
  // Collapsible sections for Delegations and Self-Delegations
  const [showDelegationsSection, setShowDelegationsSection] = useState(false)
  const [showDedelegationsSection, setShowDedelegationsSection] = useState(false)
  const [account, setAccount] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState(null)
  const [connectedProvider, setConnectedProvider] = useState(null)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [balance, setBalance] = useState('0')
  const [votingPower, setVotingPower] = useState('0')
  const [currentDelegate, setCurrentDelegate] = useState('')
  const [delegationType, setDelegationType] = useState('self')
  const [selectedSteward, setSelectedSteward] = useState(null)
  const [customAddress, setCustomAddress] = useState('')
  const [delegationHistory, setDelegationHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Accessibility: trap focus in modal and close on Esc
  useEffect(() => {
    if (!showWalletModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowWalletModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showWalletModal]);

  // Accessibility: focus first button in modal
  useEffect(() => {
    if (showWalletModal) {
      setTimeout(() => {
        const btn = document.querySelector('[data-wallet-btn]');
        if (btn) btn.focus();
      }, 100);
    }
  }, [showWalletModal]);

  // Error message for getTokenInfo
  const [tokenInfoError, setTokenInfoError] = useState('');

  // ...existing code...
  const [ensNames, setEnsNames] = useState({})
  const [showAllStewards, setShowAllStewards] = useState(false)

  // Show first 5 stewards initially, then all when expanded
  const INITIAL_STEWARDS_COUNT = 5
  const displayedStewards = showAllStewards ? ALL_UNLOCK_STEWARDS : ALL_UNLOCK_STEWARDS.slice(0, INITIAL_STEWARDS_COUNT)

  // Load delegation history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('unlock_delegations')
    if (saved) {
      try {
        const parsedHistory = JSON.parse(saved)
        setDelegationHistory(parsedHistory)
      } catch (error) {
        console.error('Error loading delegation history:', error)
        setDelegationHistory([])
      }
    }
  }, [])

  // Load ENS names for stewards
  useEffect(() => {
    const loadEnsNames = async () => {
      const names = {}
      for (const steward of ALL_UNLOCK_STEWARDS) {
        try {
          // Try to resolve ENS name
          const ensName = await resolveENS(steward.address)
          if (ensName) {
            names[steward.address] = ensName
          }
        } catch (error) {
          console.log(`No ENS name found for ${steward.address}`)
        }
      }
      setEnsNames(names)
    }
    
    if (isConnected) {
      loadEnsNames()
    }
  }, [isConnected])

  // Initialize WalletConnect
  const initWalletConnect = async () => {
    try {
      // In a real app, you'd use @walletconnect/web3-provider
      // For demo purposes, we'll simulate the connection
      const provider = {
        enable: async () => {
          // Simulate WalletConnect connection
          await new Promise(resolve => setTimeout(resolve, 2000))
          return ['0x1234567890123456789012345678901234567890'] // Demo address
        },
        request: async (params) => {
          // Simulate wallet requests
          if (params.method === 'eth_requestAccounts') {
            return ['0x1234567890123456789012345678901234567890']
          }
          return null
        }
      }
      
      setConnectedProvider(provider)
      return provider
    } catch (error) {
      console.error('Failed to initialize WalletConnect:', error)
      throw error
    }
  }

  // Resolve ENS name for an address
  const resolveENS = async (address) => {
    try {
      // Use a public ENS resolver
      const response = await fetch(`https://api.ensideas.com/ens/resolve/${address}`)
      const data = await response.json()
      return data.name || null
    } catch (error) {
      return null
    }
  }

  // Get display name for address (ENS name or formatted address)
  const getDisplayName = (address, fallbackName = null) => {
    const ensName = ensNames[address]
    if (ensName) return ensName
    if (fallbackName) return fallbackName
    return formatAddress(address)
  }

  // Get specific wallet provider
  const getWalletProvider = (walletId) => {
    if (typeof window.ethereum === 'undefined') {
      return null
    }

    // Handle multiple wallet providers
    if (window.ethereum.providers && window.ethereum.providers.length > 0) {
      // Multiple wallets installed
      const providers = window.ethereum.providers
      
      switch (walletId) {
        case 'metamask':
          return providers.find(p => p.isMetaMask && !p.isRainbow && !p.isCoinbaseWallet && !p.isTrust) || 
                 providers.find(p => p.isMetaMask)
        case 'rainbow':
          return providers.find(p => p.isRainbow)
        case 'coinbase':
          return providers.find(p => p.isCoinbaseWallet)
        case 'trust':
          return providers.find(p => p.isTrust)
        default:
          return window.ethereum
      }
    } else {
      // Single wallet provider
      const provider = window.ethereum
      
      switch (walletId) {
        case 'metamask':
          return provider.isMetaMask ? provider : null
        case 'rainbow':
          return provider.isRainbow ? provider : null
        case 'coinbase':
          return provider.isCoinbaseWallet ? provider : null
        case 'trust':
          return provider.isTrust ? provider : null
        default:
          return provider
      }
    }
  }

  // Connect to specific wallet
  const connectWallet = async (walletId) => {
    setIsLoading(true)
    setMessage('Connecting to wallet...')
    
    try {
      let accounts = []
      let provider = null
      const walletConfig = WALLET_CONFIG.find(w => w.id === walletId)
      
      if (walletId === 'walletconnect' || walletId === 'mobile') {
        // WalletConnect connection
        provider = await initWalletConnect()
        accounts = await provider.enable()
      } else {
        // Get the specific wallet provider
        provider = getWalletProvider(walletId)
        
        if (!provider) {
          // If specific wallet not found, show download link
          const downloadUrl = walletConfig?.downloadUrl
          if (downloadUrl) {
            setMessage(`❌ ${walletConfig.name} is not installed. Please install it first.`)
            setTimeout(() => {
              window.open(downloadUrl, '_blank')
            }, 2000)
            return
          } else {
            throw new Error(`${walletConfig.name} is not installed.`)
          }
        }
        
        // Connect with the specific wallet provider
        accounts = await provider.request({
          method: 'eth_requestAccounts'
        })
      }
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }
      
      // Switch to Base network
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }], // Base chain ID
        })
      } catch (switchError) {
        if (switchError.code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x2105',
              chainName: 'Base',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org']
            }]
          })
        }
      }
      
      setAccount(accounts[0])
      setIsConnected(true)
      setConnectedWallet(walletConfig)
      setConnectedProvider(provider)
      setShowWalletModal(false)
      setMessage(`✅ Connected to ${walletConfig.name}!`)
      
      // Get token info
      await getTokenInfo(accounts[0])
      
    } catch (error) {
      console.error('Connection error:', error)
      setMessage('❌ Failed to connect: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount('')
    setIsConnected(false)
    setConnectedWallet(null)
    setConnectedProvider(null)
    setBalance('0')
    setVotingPower('0')
    setCurrentDelegate('')
    setMessage('Wallet disconnected')
  }

  // Create contract instance using ethers.js v6 and the connected provider
  const createContract = () => {
    let provider;
    if (connectedProvider) {
      // If already a BrowserProvider, use as is
      if (connectedProvider instanceof ethers.BrowserProvider) {
        provider = connectedProvider;
      } else {
        provider = new ethers.BrowserProvider(connectedProvider);
      }
    } else if (window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      setTokenInfoError('No Ethereum provider found. Please install MetaMask or another wallet.');
      return null;
    }

    // ethers v6: getSigner is async
    return provider.getSigner().then(signer => new ethers.Contract(UP_TOKEN_ADDRESS, UP_TOKEN_ABI, signer));
  };

  // Get token balance and delegation info using ethers.js v6
  const getTokenInfo = async (address) => {
    try {
      setTokenInfoError('');
      const contract = await createContract();
      if (!contract) return;

      // Fetch balance
      const rawBalance = await contract.balanceOf(address);
      const balanceInEther = Number(ethers.formatUnits(rawBalance, 18));
      setBalance(balanceInEther.toFixed(2));

      // Fetch delegate
      const delegate = await contract.delegates(address);
      setCurrentDelegate(delegate);

      // Fetch voting power
      const votes = await contract.getVotes(address);
      const votingPowerInEther = Number(ethers.formatUnits(votes, 18));
      setVotingPower(votingPowerInEther.toFixed(2));
    } catch (error) {
      setTokenInfoError('Could not fetch token info. Showing fallback values.');
      console.error('Error getting token info:', error);
      setBalance('1000.00');
      setCurrentDelegate(address);
      setVotingPower('1000.00');
    }
  };

  // Delegate tokens (with dedelegation tracking)
  const handleDelegate = async () => {
    if (!isConnected) {
      setMessage('Please connect your wallet first!')
      return
    }

    let delegateTo = ''
    let delegateeName = ''
    let delegationActionType = 'delegation'

    switch (delegationType) {
      case 'self':
        delegateTo = account
        delegateeName = 'Self'
        delegationActionType = 'selfdelegation'
        break
      case 'steward':
        if (!selectedSteward) {
          setMessage('Please select a steward!')
          return
        }
        delegateTo = selectedSteward.address
        delegateeName = getDisplayName(selectedSteward.address, selectedSteward.name)
        break
      case 'custom':
        if (!customAddress || !customAddress.startsWith('0x') || customAddress.length !== 42) {
          setMessage('Please enter a valid Ethereum address!')
          return
        }
        delegateTo = customAddress
        delegateeName = 'Custom Address'
        break
      default:
        return
    }

    setIsLoading(true)
    setMessage(delegationType === 'self' ? 'Processing self-delegation...' : 'Processing delegation...')

    try {

      const contract = await createContract();
      if (!contract) throw new Error('Could not create contract instance');

      // Check if this delegation already exists (prevent duplicates)
      const isDuplicate = delegationHistory.some(record =>
        record.from.toLowerCase() === account.toLowerCase() &&
        record.to.toLowerCase() === delegateTo.toLowerCase() &&
        Math.abs(record.timestamp - Date.now()) < 60000 // Within 1 minute
      );

      if (isDuplicate) {
        setMessage(`⚠️ Delegation already recorded recently. Skipping duplicate.`);
        setCurrentDelegate(delegateTo);
        setIsLoading(false);
        return;
      }

      // Call the delegate function directly (ethers v6)
      const tx = await contract.delegate(delegateTo);
      setMessage(delegationType === 'self' ? 'Self-delegation transaction sent! Waiting for confirmation...' : 'Transaction sent! Waiting for confirmation...');

      const receipt = await tx.wait();

      const delegationRecord = {
        from: account,
        to: delegateTo,
        toName: delegateeName,
        timestamp: Date.now(),
        transactionHash: receipt.transactionHash || tx.hash,
        type: delegationActionType,
        network: 'base',
        gasUsed: receipt.gasUsed !== undefined && receipt.gasUsed !== null ? receipt.gasUsed.toString() : 'N/A',
        blockNumber: receipt.blockNumber !== undefined && receipt.blockNumber !== null ? receipt.blockNumber.toString() : 'N/A',
        walletUsed: connectedWallet?.name || 'Unknown',
        walletId: connectedWallet?.id || 'unknown'
      }

      const newHistory = [...delegationHistory, delegationRecord]
      setDelegationHistory(newHistory)
      localStorage.setItem('unlock_delegations', JSON.stringify(newHistory))

      setCurrentDelegate(delegateTo)
      setMessage(delegationType === 'self'
        ? `✅ Successfully self-delegated! Transaction: ${receipt.transactionHash || tx.hash}`
        : `✅ Successfully delegated to ${delegateeName}! Transaction: ${receipt.transactionHash || tx.hash}`
      )

      setDelegationType('self')
      setSelectedSteward(null)
      setCustomAddress('')

      await getTokenInfo(account)

    } catch (error) {
      console.error('Delegation error:', error)
      setMessage('❌ Delegation failed: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  // Generate color from address for avatar
  const getColorFromAddress = (address) => {
    const hash = address.slice(2, 8)
    const hue = parseInt(hash, 16) % 360
    return [`hsl(${hue}, 70%, 50%)`, `hsl(${(hue + 60) % 360}, 70%, 60%)`]
  }

  // Wallet Modal Component
  // Wallet Modal Component (with accessibility improvements)
  const WalletModal = () => (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}
        >
          <h2 id="wallet-modal-title" style={{ margin: 0, fontSize: '24px', color: '#1f2937' }}>
            Connect Wallet
          </h2>
          <button
            aria-label="Close wallet modal"
            onClick={() => setShowWalletModal(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '16px' }}>
          Choose your preferred wallet to connect and start delegating your UP tokens.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {WALLET_CONFIG.map((wallet, idx) => {
            const isAvailable = wallet.checkAvailability();
            const isWalletConnect = wallet.type === 'walletconnect';
            const canConnect = isAvailable || isWalletConnect || typeof window.ethereum !== 'undefined';
            return (
              <button
                key={wallet.id}
                data-wallet-btn={idx === 0 ? true : undefined}
                aria-label={`Connect ${wallet.name}`}
                onClick={() => !isLoading && connectWallet(wallet.id)}
                disabled={isLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.5rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: canConnect ? 'white' : '#f9fafb',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: canConnect ? 1 : 0.7,
                  width: '100%',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (canConnect && !isLoading) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.backgroundColor = '#eff6ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canConnect && !isLoading) {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={{
                  fontSize: '32px',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '12px'
                }}>
                  {wallet.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '0.25rem'
                  }}>
                    {wallet.name}
                    {!isAvailable && !isWalletConnect && (
                      <span style={{
                        fontSize: '12px',
                        color: '#f59e0b',
                        fontWeight: 'normal',
                        marginLeft: '0.5rem'
                      }}>
                        (Click to install)
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    {wallet.description}
                  </div>
                </div>
                <div style={{
                  fontSize: '20px',
                  color: '#6b7280'
                }}>
                  {!isAvailable && !isWalletConnect && typeof window.ethereum === 'undefined' ? '📥' : '→'}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #0ea5e9'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <span style={{ fontSize: '16px' }}>💡</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#0c4a6e' }}>
              Don't have a wallet?
            </span>
          </div>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#0c4a6e',
            marginBottom: '0.5rem'
          }}>
            Click on any wallet above to be redirected to their download page.
            We recommend MetaMask for beginners - it's free, secure, and easy to use.
          </p>
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: '#0369a1'
          }}>
            💡 <strong>Pro tip:</strong> WalletConnect and Mobile Wallet work with any mobile wallet app!
          </p>
        </div>

        {message && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: message.includes('✅') ? '#dcfce7' : 
                       message.includes('❌') ? '#fee2e2' : '#dbeafe',
            color: message.includes('✅') ? '#166534' : 
                   message.includes('❌') ? '#dc2626' : '#1e40af',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#2563eb',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                UP
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '24px', color: '#1f2937' }}>
                  Unlock Protocol Voting Delegation
                </h1>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                  Delegate your UP token voting rights on Base network
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {isConnected ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Connected via {connectedWallet?.name}
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#1f2937' }}>
                      {formatAddress(account)}
                    </div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowWalletModal(true)}
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>

        {!isConnected ? (
          /* Connect Wallet Preview */
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>Choose Your Wallet</h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Select from multiple wallet options to connect and start delegating your UP tokens
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {WALLET_CONFIG.slice(0, 3).map((wallet) => {
                const isAvailable = wallet.checkAvailability()
                const isWalletConnect = wallet.type === 'walletconnect'
                const canConnect = isAvailable || isWalletConnect || typeof window.ethereum !== 'undefined'
                
                return (
                  <button
                    key={wallet.id}
                    onClick={() => connectWallet(wallet.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      backgroundColor: canConnect ? '#f9fafb' : '#f3f4f6',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: canConnect ? 1 : 0.7,
                      width: '100%',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (canConnect) {
                        e.target.style.borderColor = '#3b82f6'
                        e.target.style.backgroundColor = '#eff6ff'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (canConnect) {
                        e.target.style.borderColor = '#e5e7eb'
                        e.target.style.backgroundColor = '#f9fafb'
                      }
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{wallet.icon}</span>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: '#1f2937' }}>
                        {wallet.name}
                        {!isAvailable && !isWalletConnect && (
                          <span style={{
                            fontSize: '12px',
                            color: '#f59e0b',
                            fontWeight: 'normal',
                            marginLeft: '0.5rem'
                          }}>
                            (Click to install)
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>{wallet.description}</div>
                    </div>
                    <div style={{
                      fontSize: '16px',
                      color: '#6b7280'
                    }}>
                      {!isAvailable && !isWalletConnect && typeof window.ethereum === 'undefined' ? '📥' : '→'}
                    </div>
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => setShowWalletModal(true)}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              More Wallet Options
            </button>
            
            {message && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: message.includes('✅') ? '#dcfce7' : message.includes('❌') ? '#fee2e2' : '#dbeafe',
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                {message}
              </div>
            )}
          </div>
        ) : (
          /* Main App */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Delegation Form */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Delegate Voting Rights</h2>
              
              {/* Real Mode Warning */}
              <div style={{
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
                  ⚠️ <strong>LIVE MODE:</strong> This will make actual blockchain transactions with real gas fees on Base network!
                </p>
              </div>
              
              {/* Account Info */}
              <div style={{
                background: '#f9fafb',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '14px' }}>
                  <div>
                    <div style={{ color: '#6b7280' }}>UP Balance:</div>
                    <div style={{ fontWeight: 'bold' }}>{balance} UP</div>
                  </div>
                  <div>
                    <div style={{ color: '#6b7280' }}>Voting Power:</div>
                    <div style={{ fontWeight: 'bold' }}>{votingPower} UP</div>
                  </div>
                  <div>
                    <div style={{ color: '#6b7280' }}>Wallet:</div>
                    <div style={{ fontWeight: 'bold' }}>{connectedWallet?.name}</div>
                  </div>
                  <div>
                    <div style={{ color: '#6b7280' }}>Network:</div>
                    <div style={{ fontWeight: 'bold' }}>Base (Live)</div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ color: '#6b7280' }}>Currently Delegated To:</div>
                    <div style={{ fontWeight: 'bold' }}>
                      {currentDelegate ? formatAddress(currentDelegate) : 'Not delegated'}
                    </div>
                  </div>
                </div>
                {tokenInfoError && (
                  <div style={{
                    marginTop: '1rem',
                    background: '#fee2e2',
                    color: '#dc2626',
                    borderRadius: '6px',
                    padding: '0.75rem',
                    fontSize: '14px',
                    textAlign: 'center',
                    border: '1px solid #fca5a5'
                  }}>
                    {tokenInfoError}
                  </div>
                )}
              </div>

              {/* Delegation Options */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '1rem', display: 'block' }}>
                  Choose delegation option:
                </label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="radio"
                      name="delegationType"
                      value="self"
                      checked={delegationType === 'self'}
                      onChange={(e) => setDelegationType(e.target.value)}
                    />
                    Delegate to myself
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="radio"
                      name="delegationType"
                      value="steward"
                      checked={delegationType === 'steward'}
                      onChange={(e) => setDelegationType(e.target.value)}
                    />
                    Delegate to an Unlock Protocol steward
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="radio"
                      name="delegationType"
                      value="custom"
                      checked={delegationType === 'custom'}
                      onChange={(e) => setDelegationType(e.target.value)}
                    />
                    Delegate to a specific address
                  </label>
                </div>
              </div>

              {/* Steward Selection */}
              {delegationType === 'steward' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0 }}>Select a Steward:</h4>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      Showing {displayedStewards.length} of {ALL_UNLOCK_STEWARDS.length} delegates
                    </span>
                  </div>
                  
                  <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {displayedStewards.map((steward, index) => {
                      const displayName = getDisplayName(steward.address, steward.name)
                      const isEnsName = ensNames[steward.address]
                      
                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedSteward(steward)}
                          style={{
                            border: selectedSteward?.address === steward.address ? '2px solid #2563eb' : '1px solid #d1d5db',
                            borderRadius: '8px',
                            padding: '1rem',
                            marginBottom: '0.5rem',
                            cursor: 'pointer',
                            background: selectedSteward?.address === steward.address ? '#eff6ff' : 'white',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            {/* Rank Badge */}
                            <div style={{
                              minWidth: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: steward.rank <= 5 ? '#10b981' : steward.rank <= 10 ? '#3b82f6' : '#6b7280',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 'bold'
                            }}>
                              #{steward.rank}
                            </div>
                            
                            {/* Avatar */}
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${getColorFromAddress(steward.address)})`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '12px'
                            }}>
                              {isEnsName ? '🏛️' : (steward.address.slice(2, 4).toUpperCase())}
                            </div>
                            
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ 
                                  fontWeight: 'bold',
                                  color: isEnsName ? '#059669' : '#1f2937',
                                  fontSize: '14px'
                                }}>
                                  {displayName}
                                  {isEnsName && <span style={{ marginLeft: '0.5rem', fontSize: '12px' }}>✓</span>}
                                </span>
                                <span style={{ fontSize: '11px', color: '#6b7280' }}>
                                  {formatAddress(steward.address)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, paddingLeft: '3.5rem' }}>
                            {steward.description}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Load More Button */}
                  {!showAllStewards && ALL_UNLOCK_STEWARDS.length > INITIAL_STEWARDS_COUNT && (
                    <button
                      onClick={() => setShowAllStewards(true)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        marginTop: '1rem',
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151'
                      }}
                    >
                      Load More Stewards 
                    </button>
                  )}
                  
                  {/* Show Less Button */}
                  {showAllStewards && (
                    <button
                      onClick={() => setShowAllStewards(false)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        marginTop: '1rem',
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#374151'
                      }}
                    >
                      Show Less
                    </button>
                  )}
                </div>
              )}

              {/* Custom Address */}
              {delegationType === 'custom' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Enter Ethereum Address:
                  </label>
                  <input
                    type="text"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="0x..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}

              {/* Submit Button */}
              <div style={{ display: 'flex', gap: '1rem', flexDirection: 'row' }}>
                <button
                  onClick={handleDelegate}
                  disabled={isLoading}
                  style={{
                    background: isLoading ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    width: '100%'
                  }}
                >
                  {isLoading ? 'Processing...' : 'Delegate Voting Rights'}
                </button>
              </div>

              {message && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: message.includes('✅') ? '#dcfce7' : message.includes('❌') ? '#fee2e2' : '#dbeafe',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  {message}
                </div>
              )}

              {/* Info Box */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: '#eff6ff',
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>About Delegation</h4>
                <p style={{ margin: 0, color: '#1e40af' }}>
                  Delegating allows you or someone else to vote on your behalf in Unlock Protocol governance.
                  You can change your delegation at any time by self delegation. Your tokens remain in your wallet.
                </p>
              </div>
            </div>

            {/* Delegation History */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Delegation History</h2>
              
              {delegationHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  <p>No delegation history yet</p>
                  <p style={{ fontSize: '14px' }}>Your delegation transactions will appear here</p>
                </div>
              ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {delegationHistory.slice().reverse().map((record, index) => (
                    <div key={index} style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{
                          background: record.type === 'dedelegation' ? '#fef3c7' : '#dcfce7',
                          color: record.type === 'dedelegation' ? '#92400e' : '#166534',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {record.type === 'dedelegation' ? 'Dedelegation' : 'Delegation'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {formatDate(record.timestamp)}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '14px', marginBottom: '0.5rem' }}>
                        <strong>To:</strong> {getDisplayName(record.to, record.toName)} ({formatAddress(record.to)})
                      </div>
                      
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '0.5rem' }}>
                        <strong>Wallet:</strong> {record.walletUsed || 'Unknown'}
                        {' • '}
                        <strong>Network:</strong> {record.network}
                        {record.gasUsed && record.gasUsed !== 'N/A' && (
                          <>
                            {' • '}
                            <strong>Gas Used:</strong> {record.gasUsed}
                          </>
                        )}
                        {record.blockNumber && record.blockNumber !== 'N/A' && (
                          <>
                            {' • '}
                            <strong>Block:</strong> {record.blockNumber}
                          </>
                        )}
                      </div>
                      
                      {record.transactionHash && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <a
                            href={`https://basescan.org/tx/${record.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '12px', color: '#2563eb' }}
                          >
                            View on BaseScan →
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div style={{
                background: '#f9fafb',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, color: '#1f2937' }}>Delegation Counter</h4>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* Remove Duplicates button removed as per user request */}
                   
                  </div>
                </div>
                {/* Counters first */}
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                  Total delegations made: <strong>{delegationHistory.length}</strong>
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
                  Total self delegations: <strong>{delegationHistory.filter(r => r.type === 'selfdelegation').length}</strong>
                </p>
                {/* Delegation and Dedelegation Sections */}
                <div style={{ display: 'flex', gap: '2rem', margin: '1rem 0' }}>
                  {/* Collapsible Delegations Section */}
                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => setShowDelegationsSection(s => !s)}
                      style={{
                        width: '100%',
                        background: '#dcfce7',
                        color: '#166534',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 0.75rem',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.2s',
                        gap: '0.5rem',
                        boxShadow: showDelegationsSection ? '0 2px 8px #dcfce7' : 'none'
                      }}
                    >
                      <span style={{ flex: 1, textAlign: 'left' }}>Delegations</span>
                      <span style={{ fontSize: '13px', marginLeft: 8, transition: 'transform 0.2s', display: 'inline-block', transform: showDelegationsSection ? 'rotate(180deg)' : 'none' }}>
                        ▼
                      </span>
                    </button>
                    {showDelegationsSection && (
                      <div style={{ maxHeight: '180px', overflowY: 'auto', background: '#f3f4f6', borderRadius: '6px', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '13px' }}>
                          {delegationHistory.filter(r => r.type !== 'selfdelegation').length === 0 ? (
                            <li style={{ color: '#6b7280', padding: '0.5rem' }}>No delegations</li>
                          ) : (
                            delegationHistory.filter(r => r.type !== 'selfdelegation').map((r, i) => (
                              <li key={i} style={{ marginBottom: '0.25rem', padding: '0.5rem 0.5rem 0.5rem 0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                                <span style={{ color: '#1f2937', fontWeight: 500 }}>{getDisplayName(r.to, r.toName)}</span>
                                <span style={{ color: '#6b7280', marginLeft: 6 }}>({formatAddress(r.to)})</span>
                                <span style={{ color: '#6b7280', marginLeft: 6 }}>{formatDate(r.timestamp)}</span>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  {/* Collapsible Dedelegations Section */}
                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => setShowDedelegationsSection(s => !s)}
                      style={{
                        width: '100%',
                        background: '#fef3c7',
                        color: '#92400e',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 0.75rem',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.2s',
                        gap: '0.5rem',
                        boxShadow: showDedelegationsSection ? '0 2px 8px #fef3c7' : 'none'
                      }}
                    >
                      <span style={{ flex: 1, textAlign: 'left' }}>Self Delegations</span>
                      <span style={{ fontSize: '13px', marginLeft: 8, transition: 'transform 0.2s', display: 'inline-block', transform: showDedelegationsSection ? 'rotate(180deg)' : 'none' }}>
                        ▼
                      </span>
                    </button>
                    {showDedelegationsSection && (
                      <div style={{ maxHeight: '180px', overflowY: 'auto', background: '#f3f4f6', borderRadius: '6px', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '13px' }}>
                          {delegationHistory.filter(r => r.type === 'selfdelegation').length === 0 ? (
                            <li style={{ color: '#6b7280', padding: '0.5rem' }}>No self delegations</li>
                          ) : (
                            delegationHistory.filter(r => r.type === 'selfdelegation').map((r, i) => (
                              <li key={i} style={{ marginBottom: '0.25rem', padding: '0.5rem 0.5rem 0.5rem 0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                                <span style={{ color: '#1f2937', fontWeight: 500 }}>{getDisplayName(r.to, r.toName)}</span>
                                <span style={{ color: '#6b7280', marginLeft: 6 }}>({formatAddress(r.to)})</span>
                                <span style={{ color: '#6b7280', marginLeft: 6 }}>{formatDate(r.timestamp)}</span>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Wallet Modal */}
      {showWalletModal && <WalletModal />}
    </div>
  )
}

export default App