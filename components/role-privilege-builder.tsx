'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface Privilege {
  resource: {
    db?: string;
    collection?: string;
    cluster?: boolean;
  };
  actions: string[];
}

interface RolePrivilegeBuilderProps {
  privileges: Privilege[];
  onChange: (privileges: Privilege[]) => void;
}

const COLLECTION_ACTIONS = [
  'find', 'insert', 'remove', 'update', 'bypassDocumentValidation',
  'changeStream', 'collStats', 'convertToCapped', 'createCollection',
  'createIndex', 'dbHash', 'dbStats', 'dropCollection', 'dropIndex',
  'emptycapped', 'listCollections', 'listIndexes', 'planCacheRead',
  'reIndex', 'renameCollectionSameDB', 'storageDetails', 'validate'
];

const DATABASE_ACTIONS = [
  'changeStream', 'collStats', 'convertToCapped', 'createCollection',
  'createIndex', 'dbHash', 'dbStats', 'dropCollection', 'dropDatabase',
  'dropIndex', 'enableProfiler', 'killCursors', 'listCollections',
  'listIndexes', 'planCacheRead', 'planCacheWrite', 'reIndex',
  'renameCollectionSameDB', 'repairDatabase', 'storageDetails'
];

const GLOBAL_ACTIONS = [
  'addShard', 'applicationMessage', 'appendOplogNote', 'auditLogRotate',
  'changeCustomData', 'changePassword', 'changeOwnPassword', 'changeOwnCustomData',
  'checkFreeMonitoringStatus', 'closeAllDatabases', 'connPoolStats',
  'connPoolSync', 'cpuProfiler', 'createDatabase', 'createRole',
  'createUser', 'dropDatabase', 'dropRole', 'dropUser', 'enableSharding',
  'flushRouterConfig', 'fsync', 'getCmdLineOpts', 'getLog', 'getParameter',
  'getShardMap', 'getShardVersion', 'grantRole', 'hostInfo', 'invalidateUserCache',
  'killop', 'listDatabases', 'listSessions', 'listShards', 'logRotate',
  'netstat', 'removeShard', 'replSetConfigure', 'replSetGetConfig',
  'replSetGetStatus', 'replSetHeartbeat', 'replSetReconfig',
  'replSetResizeOplog', 'replSetStateChange', 'resync', 'revokeRole',
  'serverStatus', 'setFeatureCompatibilityVersion', 'setFreeMonitoring',
  'setParameter', 'shardCollection', 'shutdown', 'splitChunk', 'splitVector',
  'top', 'touch', 'trafficRecord', 'unlock', 'useUUID', 'viewRole', 'viewUser'
];

export function RolePrivilegeBuilder({ privileges, onChange }: RolePrivilegeBuilderProps) {
  const [activeTab, setActiveTab] = useState<'collection' | 'database' | 'global'>('collection');

  const [collectionPrivilege, setCollectionPrivilege] = useState({
    database: '',
    collection: '',
    allCollections: false,
    selectedActions: [] as string[],
  });

  const [databasePrivilege, setDatabasePrivilege] = useState({
    database: '',
    selectedActions: [] as string[],
  });

  const [globalPrivilege, setGlobalPrivilege] = useState({
    selectedActions: [] as string[],
  });

  const addCollectionPrivilege = () => {
    if (!collectionPrivilege.database || (!collectionPrivilege.collection && !collectionPrivilege.allCollections)) {
      return;
    }

    if (collectionPrivilege.selectedActions.length === 0) {
      return;
    }

    const newPrivilege: Privilege = {
      resource: {
        db: collectionPrivilege.database,
        collection: collectionPrivilege.allCollections ? '' : collectionPrivilege.collection,
      },
      actions: collectionPrivilege.selectedActions,
    };

    onChange([...privileges, newPrivilege]);
    setCollectionPrivilege({ database: '', collection: '', allCollections: false, selectedActions: [] });
  };

  const addDatabasePrivilege = () => {
    if (!databasePrivilege.database || databasePrivilege.selectedActions.length === 0) {
      return;
    }

    const newPrivilege: Privilege = {
      resource: {
        db: databasePrivilege.database,
      },
      actions: databasePrivilege.selectedActions,
    };

    onChange([...privileges, newPrivilege]);
    setDatabasePrivilege({ database: '', selectedActions: [] });
  };

  const addGlobalPrivilege = () => {
    if (globalPrivilege.selectedActions.length === 0) {
      return;
    }

    const newPrivilege: Privilege = {
      resource: {
        cluster: true,
      },
      actions: globalPrivilege.selectedActions,
    };

    onChange([...privileges, newPrivilege]);
    setGlobalPrivilege({ selectedActions: [] });
  };

  const removePrivilege = (index: number) => {
    onChange(privileges.filter((_, i) => i !== index));
  };

  const toggleAction = (action: string, selectedActions: string[], setter: Function) => {
    if (selectedActions.includes(action)) {
      setter((prev: any) => ({
        ...prev,
        selectedActions: prev.selectedActions.filter((a: string) => a !== action),
      }));
    } else {
      setter((prev: any) => ({
        ...prev,
        selectedActions: [...prev.selectedActions, action],
      }));
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="global">Global</TabsTrigger>
        </TabsList>

        <TabsContent value="collection" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Database</Label>
                  <Input
                    placeholder="Database name"
                    value={collectionPrivilege.database}
                    onChange={(e) => setCollectionPrivilege({ ...collectionPrivilege, database: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Collection</Label>
                  <Input
                    placeholder="Collection name"
                    value={collectionPrivilege.collection}
                    onChange={(e) => setCollectionPrivilege({ ...collectionPrivilege, collection: e.target.value })}
                    disabled={collectionPrivilege.allCollections}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all-collections"
                  checked={collectionPrivilege.allCollections}
                  onCheckedChange={(checked) =>
                    setCollectionPrivilege({ ...collectionPrivilege, allCollections: checked as boolean, collection: '' })
                  }
                />
                <Label htmlFor="all-collections" className="font-normal cursor-pointer">
                  All collections in database
                </Label>
              </div>
              <div className="space-y-2">
                <Label>Actions</Label>
                <div className="border rounded-md p-3 max-h-64 overflow-y-auto grid grid-cols-2 gap-2">
                  {COLLECTION_ACTIONS.map((action) => (
                    <div key={action} className="flex items-center space-x-2">
                      <Checkbox
                        id={`col-${action}`}
                        checked={collectionPrivilege.selectedActions.includes(action)}
                        onCheckedChange={() => toggleAction(action, collectionPrivilege.selectedActions, setCollectionPrivilege)}
                      />
                      <Label htmlFor={`col-${action}`} className="font-normal text-sm cursor-pointer">
                        {action}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={addCollectionPrivilege} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Collection Privilege
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Database</Label>
                <Input
                  placeholder="Database name"
                  value={databasePrivilege.database}
                  onChange={(e) => setDatabasePrivilege({ ...databasePrivilege, database: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Actions</Label>
                <div className="border rounded-md p-3 max-h-64 overflow-y-auto grid grid-cols-2 gap-2">
                  {DATABASE_ACTIONS.map((action) => (
                    <div key={action} className="flex items-center space-x-2">
                      <Checkbox
                        id={`db-${action}`}
                        checked={databasePrivilege.selectedActions.includes(action)}
                        onCheckedChange={() => toggleAction(action, databasePrivilege.selectedActions, setDatabasePrivilege)}
                      />
                      <Label htmlFor={`db-${action}`} className="font-normal text-sm cursor-pointer">
                        {action}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={addDatabasePrivilege} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Database Privilege
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Actions</Label>
                <div className="border rounded-md p-3 max-h-64 overflow-y-auto grid grid-cols-2 gap-2">
                  {GLOBAL_ACTIONS.map((action) => (
                    <div key={action} className="flex items-center space-x-2">
                      <Checkbox
                        id={`global-${action}`}
                        checked={globalPrivilege.selectedActions.includes(action)}
                        onCheckedChange={() => toggleAction(action, globalPrivilege.selectedActions, setGlobalPrivilege)}
                      />
                      <Label htmlFor={`global-${action}`} className="font-normal text-sm cursor-pointer">
                        {action}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={addGlobalPrivilege} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Global Privilege
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {privileges.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Added Privileges</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {privileges.map((privilege, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-slate-50 dark:bg-slate-900">
                <div className="flex-1 space-y-1">
                  <div className="text-sm font-medium">
                    {privilege.resource.cluster ? (
                      <span className="text-blue-600 dark:text-blue-400">Cluster</span>
                    ) : privilege.resource.collection !== undefined ? (
                      <span>
                        {privilege.resource.db} / {privilege.resource.collection || 'All Collections'}
                      </span>
                    ) : (
                      <span>{privilege.resource.db}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {privilege.actions.map((action, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePrivilege(index)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
