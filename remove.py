import os
import shutil

print('Se eliminaran los archivos para empezar de nuevo la red de Hyperledger Fabric, son:\n\n')
print(' + Bloque genesis \n + Config de canal orderer y subcarpetas \n + Config de peer0 y peer1, chaincode y subcarpetas. \n\n')
print('Se eliminara la carpeta cryptografica, hay que volver a generar certificados. \n\n')
print('Escribe "ok" para continuar...')

key = input()


def eliminar_archivo(ruta):
    try:
        os.remove(ruta)
    except:
        pass
    try:
        shutil.rmtree(ruta)
    except:
        pass


if key == 'ok': 

    eliminar_archivo('genesis/genesis_block.pb')
    eliminar_archivo('orderer/etcdraftwal/channel1')
    eliminar_archivo('orderer/ledger/chains')
    eliminar_archivo('orderer/ledger/index')
    eliminar_archivo('orderer/ledger/pendingops')
    eliminar_archivo('orderer/snapdir/channel1')
    eliminar_archivo('peer0/production/chaincodes')
    eliminar_archivo('peer0/production/externalbuilder')
    eliminar_archivo('peer0/production/ledgersData')
    eliminar_archivo('peer0/production/lifecycle')
    eliminar_archivo('peer0/production/transientstore')
    eliminar_archivo('peer0/production/transientStoreFileLock')
    eliminar_archivo('peer0/snapshots/completed')
    eliminar_archivo('peer1/production/chaincodes')
    eliminar_archivo('peer1/production/externalbuilder')
    eliminar_archivo('peer1/production/ledgersData')
    eliminar_archivo('peer1/production/lifecycle')
    eliminar_archivo('peer1/production/transientstore')
    eliminar_archivo('peer1/production/transientStoreFileLock')
    eliminar_archivo('peer1/snapshots/completed')
    eliminar_archivo('peer0/snapshots/temp')
    eliminar_archivo('peer1/snapshots/temp')
    #eliminar_archivo('cryptogen/crypto-config')
else:
    print('\n\n\n\n\n')
    print('Operacion cancelada')

exit()