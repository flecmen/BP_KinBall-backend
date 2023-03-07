import Logger from "../utils/logger";
import { Prisma, PrismaClient, Group } from "@prisma/client";

const prisma = new PrismaClient();

export default {
    async getGroup(groupWhereUniqueInput: Prisma.GroupWhereUniqueInput) {
        return prisma.group.findUnique({
            where: groupWhereUniqueInput
        })
    },

    async createGroup(groupCreateInput: Prisma.GroupCreateInput) {
        const new_group = await prisma.group.create({
            data: groupCreateInput,
        });
        return await this.getGroup({ id: new_group.id })
    }
}