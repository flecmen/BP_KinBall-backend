import Logger from "../utils/logger";
import { Prisma, PrismaClient, Group } from "@prisma/client";

const prisma = new PrismaClient();

export default {
    async getGroup(groupWhereUniqueInput: Prisma.GroupWhereUniqueInput) {
        try {
            return prisma.group.findUnique({
                where: groupWhereUniqueInput
            })
        } catch (e) {
            Logger.error(`group-service.getGroup: ${e}`)
        }
    },

    async createGroup(groupCreateInput: Prisma.GroupCreateInput) {
        try {
            const new_group = await prisma.group.create({
                data: groupCreateInput,
            });
            return await this.getGroup({ id: new_group.id })
        } catch (e) {
            Logger.error(`group-service.createGroup: ${e}`)
        }
    },

    async updateGroup(groupId: Group['id'], groupUpdateInput: Prisma.GroupUpdateInput) {
        try {
            const updated_group = await prisma.group.update({
                where: { id: groupId },
                data: groupUpdateInput,
            });
            return await this.getGroup({ id: updated_group.id })
        } catch (e) {
            Logger.error(`group-service.updateGroup: ${e}`)
        }
    },
    async deleteGroup(groupId: Group['id']) {
        try {
            return await prisma.group.delete({
                where: { id: groupId },
            });
        } catch (e) {
            Logger.error(`group-service.deleteGroup: ${e}`)
        }
    }
}