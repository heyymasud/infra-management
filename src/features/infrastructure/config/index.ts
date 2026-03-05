import {
  Globe,
  Server,
  Database,
  Shield,
  Cloud,
  MemoryStick,
  MessageSquare,
  Network,
  Box,
  Layers,
} from 'lucide-react';
import type { InfraNodeType, NodePaletteItem, GroupPaletteItem } from '../types';

// Node Palette Config
export const NODE_PALETTE: NodePaletteItem[] = [
  { type: 'loadBalancer', icon: Network, label: 'Load Balancer', color: '#8b5cf6', description: 'Distributes incoming traffic' },
  { type: 'firewall', icon: Shield, label: 'Firewall', color: '#ef4444', description: 'Network security barrier' },
  { type: 'webServer', icon: Globe, label: 'Web Server', color: '#3b82f6', description: 'Serves web content' },
  { type: 'appServer', icon: Server, label: 'App Server', color: '#10b981', description: 'Application logic layer' },
  { type: 'database', icon: Database, label: 'Database', color: '#f59e0b', description: 'Data persistence layer' },
  { type: 'cache', icon: MemoryStick, label: 'Cache', color: '#06b6d4', description: 'In-memory data cache' },
  { type: 'messageQueue', icon: MessageSquare, label: 'Message Queue', color: '#ec4899', description: 'Async message broker' },
  { type: 'cloud', icon: Cloud, label: 'Cloud Service', color: '#6366f1', description: 'Cloud provider service' },
];

// Group Palette Config
export const GROUP_PALETTE: GroupPaletteItem[] = [
  { groupType: 'environment', icon: Box, label: 'Environment', color: '#8b5cf6', description: 'Environment group (prod, staging…)', defaultWidth: 600, defaultHeight: 400 },
  { groupType: 'layer', icon: Layers, label: 'Layer', color: '#06b6d4', description: 'Architecture layer (web, app, db…)', defaultWidth: 500, defaultHeight: 300 },
];

// Connection Validation Rules
// Maps source node type → allowed target node types
export const CONNECTION_RULES: Record<InfraNodeType, InfraNodeType[]> = {
  loadBalancer: ['webServer', 'appServer'],
  webServer: ['appServer', 'cache', 'messageQueue'],
  appServer: ['database', 'cache', 'messageQueue', 'appServer'],
  database: ['cache', 'database'],
  firewall: ['loadBalancer', 'webServer', 'appServer', 'database', 'cloud', 'cache', 'messageQueue'],
  cloud: ['loadBalancer', 'webServer', 'appServer', 'database', 'firewall', 'cache', 'messageQueue'],
  cache: ['appServer', 'webServer'],
  messageQueue: ['appServer', 'webServer'],
};
