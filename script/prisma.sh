#!/bin/bash

function generate() {
    databases=("$(ls prisma)")
    for database in $databases
    do
        pnpm prisma generate --schema ./prisma/$database/schema.prisma
    done
}

function push() {
    databases=("$(ls prisma)")
    for database in $databases
    do
        pnpm prisma db push --schema ./prisma/$database/schema.prisma
    done
}

function migrate() {
    database=$1
    commit=$2
    pnpm prisma migrate dev --schema ./prisma/$database/schema.prisma --name $commit
}

fn=$1

if [ "$fn" = "migrate" ]
then
    migrate $2 $3
else
    "${fn}"
fi