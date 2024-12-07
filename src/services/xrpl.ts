import { Client, Wallet, dropsToXrp } from 'xrpl';
import { NetworkConfig } from '../types/network';

class XRPLService {
  private static instance: XRPLService;
  private client: Client | null = null;
  private wallet: Wallet | null = null;
  private network: NetworkConfig | null = null;
  private connectionAttempts = 0;
  private readonly MAX_RETRIES = 3;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isReconnecting = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): XRPLService {
    if (!XRPLService.instance) {
      XRPLService.instance = new XRPLService();
    }
    return XRPLService.instance;
  }

  async connect(network: NetworkConfig): Promise<void> {
    console.log('Connecting to network:', network);

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    if (this.client?.isConnected() && this.network?.id === network.id) {
      return;
    }

    this.connectionPromise = this.establishConnection(network);
    
    try {
      await this.connectionPromise;
    } finally {
      this.connectionPromise = null;
    }
  }

  private async establishConnection(network: NetworkConfig): Promise<void> {
    await this.disconnect();

    try {
      this.connectionAttempts++;
      console.log(`Connection attempt ${this.connectionAttempts} to ${network.url}`);

      this.client = new Client(network.url, {
        timeout: 20000,
        connectionTimeout: 15000,
        retry: {
          maxAttempts: 3,
          minDelay: 1000,
          maxDelay: 5000
        }
      });

      this.client.on('disconnected', () => this.handleDisconnect());
      this.client.on('error', (error) => this.handleError(error));
      this.client.on('connected', () => {
        console.log('Connected to network:', network.name);
        this.connectionAttempts = 0;
        this.isReconnecting = false;
      });

      await this.client.connect();
      this.network = network;
    } catch (error) {
      console.error('Connection error:', error);
      if (this.connectionAttempts < this.MAX_RETRIES) {
        console.log(`Retrying connection (${this.connectionAttempts}/${this.MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.establishConnection(network);
      }
      this.connectionAttempts = 0;
      throw new Error(`Failed to connect to ${network.name}. Please try again or select a different network.`);
    }
  }

  private async handleDisconnect() {
    if (this.isReconnecting || !this.network) return;

    console.log('Disconnected from network. Attempting to reconnect...');
    this.isReconnecting = true;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(async () => {
      try {
        await this.connect(this.network!);
        if (this.wallet) {
          await this.createWallet(this.wallet.seed!);
        }
      } catch (error) {
        console.error('Failed to reconnect:', error);
      } finally {
        this.isReconnecting = false;
      }
    }, 1000);
  }

  private handleError(error: any) {
    console.error('XRPL client error:', error);
    if (!this.isReconnecting && this.network) {
      this.handleDisconnect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.client) {
      try {
        this.client.removeAllListeners();
        if (this.client.isConnected()) {
          await this.client.disconnect();
        }
      } catch (error) {
        console.error('Error during disconnect:', error);
      } finally {
        this.client = null;
        this.wallet = null;
        this.network = null;
        this.isReconnecting = false;
      }
    }
  }

  async createWallet(seed: string): Promise<{ wallet: Wallet; balance: number }> {
    if (!this.client?.isConnected()) {
      throw new Error('Not connected to network. Please try reconnecting.');
    }

    try {
      console.log('Creating wallet from seed:', seed);
      this.wallet = Wallet.fromSeed(seed);
      console.log('Wallet created:', {
        address: this.wallet.address,
        publicKey: this.wallet.publicKey
      });

      try {
        const response = await this.client.request({
          command: 'account_info',
          account: this.wallet.address,
          ledger_index: 'validated'
        });

        if (!response.result.account_data) {
          console.log('Account not found (not activated):', this.wallet.address);
          return {
            wallet: this.wallet,
            balance: 0
          };
        }

        const balance = Number(dropsToXrp(response.result.account_data.Balance));
        console.log('Account info retrieved:', {
          address: this.wallet.address,
          balance
        });

        return {
          wallet: this.wallet,
          balance
        };
      } catch (error: any) {
        if (error.data?.error === 'actNotFound') {
          console.log('Account not found (not activated):', this.wallet.address);
          return {
            wallet: this.wallet,
            balance: 0
          };
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Failed to create wallet:', error);
      if (error.message?.includes('Invalid seed')) {
        throw new Error('Invalid wallet seed. Please check and try again.');
      }
      throw new Error('Failed to create wallet. Please try again.');
    }
  }

  getClient(): Client | null {
    return this.client;
  }

  getWallet(): Wallet | null {
    return this.wallet;
  }

  isConnected(): boolean {
    return this.client?.isConnected() || false;
  }

  getCurrentNetwork(): NetworkConfig | null {
    return this.network;
  }
}

export const xrplService = XRPLService.getInstance();