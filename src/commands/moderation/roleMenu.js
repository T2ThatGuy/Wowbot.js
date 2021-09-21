const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const RoleMenu = require('../../database/models/rolemenu.js');
const { readConfig } = require('../../utils/json.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolemenu')
        .setDescription('Replies with Pong!')
        .addSubcommand(subcommand =>
            subcommand
            .setName("create")
            .setDescription("Create a new role menu")
            .addStringOption(option => option.setName("menu").setDescription("Name of the role menu"))
            .addChannelOption(option => option.setName("channel").setDescription("Channel ID")))
        .addSubcommand(subcommand =>
            subcommand
            .setName("delete")
            .setDescription("Delete a role menu")
            .addStringOption(option => option.setName("name").setDescription("Name of the role menu")))
        .addSubcommand(subcommand =>
            subcommand
            .setName("toggle")
            .setDescription("Toggles the menu's visability")
            .addStringOption(option => option.setName("menu").setDescription("Name of the role menu")))
        .addSubcommand(subcommand =>
            subcommand
            .setName("update")
            .setDescription("Updates a targetted menu")
            .addStringOption(option => option.setName("menu").setDescription("Name of the role menu")))
        .addSubcommand(subcommand =>
            subcommand
            .setName("color")
            .setDescription("Set the embed color of the targetted menu")
            .addStringOption(option => option.setName("menu").setDescription("Name of the role menu"))
            .addStringOption(option => option.setName("color").setDescription("HEX COLOR that is wanted")))
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup
            .setName("role")
            .setDescription("Add / Remove a role to the targetted role menu")
            .addSubcommand(subcommand =>
                subcommand
                .setName("add")
                .setDescription("Add a role to a menu")
                .addStringOption(option => option.setName("menu").setDescription("Name of the menu to add the role to"))
                .addRoleOption(option => option.setName("role").setDescription("@ The current role"))
                .addStringOption(option => option.setName("emoji").setDescription("Name for the role"))
            .addStringOption(option => option.setName("description").setDescription("Description of the role")))
                .addSubcommand(subcommand =>
                subcommand
                .setName("remove")
                .setDescription("Remove a role from a menu")
                .addStringOption(option => option.setName("menu").setDescription("Name of the menu to add the role to"))
                .addRoleOption(option => option.setName("role").setDescription("@ The role to remove"))))
        .addSubcommandGroup(subcommandgroup =>
            subcommandgroup
            .setName("description")
            .setDescription("Change or add a description to the menu")
            .addSubcommand(subcommand =>
                subcommand
                .setName("set")
                .setDescription("Adds a description to menu")
                .addStringOption(option => option.setName("menu").setDescription("Name of the role menu"))
                .addStringOption(option => option.setName("description").setDescription("New description to be used")))
            .addSubcommand(subcommand => 
                subcommand
                .setName("remove")
                .setDescription("Removes the description of the targetted menu")
                .addStringOption(option => option.setName("menu").setDescription("Name of the role menu"))))
        .addSubcommand(subcommand =>
            subcommand
            .setName("list")
            .setDescription("Lists all available role menu names")),
    
    async execute(interaction, client) {
        
        const data = await readConfig();

        if (!interaction.member.roles.cache.has(data.moderation_roles.mod_id) && !interaction.member.roles.cache.has(data.moderation_roles.admin_id)) {
			await interaction.reply('You do not have the permissions to access this command');
			setTimeout(() => {interaction.deleteReply()}, 2000);
			return;
        }

        try {
            commandGroup = interaction.options.getSubcommandGroup();
        } catch (e) {
            commandGroup = null;
        }
        
        switch (commandGroup) {
            case "role":

                switch (interaction.options.getSubcommand()) {
                    case "add":
                        // Adds the targetted role to the targetted menu
                        
                        (async (interaction) => {
                            
                            const menuName = interaction.options.getString('menu');
                            const menu = await RoleMenu.findOne({ where: {name: menuName} });

                            if (!menu) {
                                await interaction.reply('Invalid menu name');
                                setTimeout(() => interaction.deleteReply(), 1000);
                                return;
                            }

                            const roleDescription = interaction.options.getString('description');
                            const roleEmoji = interaction.options.getString('emoji');
                            const role = interaction.options.getRole('role');
                            const roleArray = JSON.parse(menu.roles);

                            const roleDict = {
                                "description": roleDescription,
                                "emoji": roleEmoji,
                                "role": role.id.toString(),
                            }

                            roleArray.push(roleDict);

                            const affectedRows = await RoleMenu.update({ roles: JSON.stringify(roleArray) }, { where: { name: menuName } });
                            if (affectedRows > 0) {
                                await interaction.reply(`${menuName} was edited. Use /toggle or /update respectively to make the changes`);
                                setTimeout(() => interaction.deleteReply(), 10000);
                            }
                            
                            updateEmbed(interaction);

                        })(interaction);
                        

                        return;
        
                    case "remove":
                        // Removes the targetted role to the targetted menu

                        (async (interaction) => {

                            const menuName = interaction.options.getString('menu');
                            const menu = await RoleMenu.findOne({ where: {name: menuName} });

                            if (!menu) {
                                await interaction.reply('Invalid menu name');
                                setTimeout(() => interaction.deleteReply(), 1000);
                                return;
                            }
                            
                            const role = interaction.options.getRole('role');
                            const roleName = role.name;
                            const roleID = role.id.toString();
                            const roles = JSON.parse(menu.roles);

                            let itemToRemove = null;

                            for (let role of roles) {
                                if (roleID === role['role']) {
                                    itemToRemove = role;
                                    break;
                                }
                            }

                            if (!itemToRemove) {
                                await interaction.reply(`The role <@&${roleID}> does not exist in the menu ${menuName}`);
                                setTimeout(() => interaction.deleteReply(), 10000);

                                return;
                            }

                            roles.splice(itemToRemove, 1);

                            const affectedRows = await RoleMenu.update({ roles: JSON.stringify(roles) }, { where: { name: menuName } });
                            if (affectedRows > 0) {
                                await interaction.reply(`Role ${roleName} was removed successfully`);
                                setTimeout(() => interaction.deleteReply(), 10000);
                            } 

                            updateEmbed(interaction);

                        })(interaction);

                        return;

                }

            case "description":
                switch (interaction.options.getSubcommand()) {
                    case "remove":
                        // Removes the description

                        (async (interaction) => {

                            const menuName = interaction.options.getString('menu');
                            const menu = await RoleMenu.findOne({ where: {name: menuName} });

                            if (!menu) {
                                await interaction.reply('Invalid menu name');
                                setTimeout(() => interaction.deleteReply(), 10000);
                                return;
                            }

                            const affectedRows = await RoleMenu.update({ description: "" }, { where: { name: menuName } });
                            if (affectedRows > 0) {
                                await interaction.reply(`Description of ${menuName} was removed successfully`);
                                setTimeout(() => interaction.deleteReply(), 10000);
                            } 

                            updateEmbed(interaction);

                        })(interaction);

                        return;
                    
                    case "set":
                        // Adds a description overrites the current one if there is one
                        (async (interaction) => {

                            const menuName = interaction.options.getString('menu');
                            const menu = await RoleMenu.findOne({ where: {name: menuName} });

                            const description = interaction.options.getString('description');

                            if (!description) {
                                await interaction.reply('No description provided');
                                setTimeout(() => interaction.deleteReply(), 10000);
                                return;
                            }

                            if (!menu) {
                                await interaction.reply('Invalid menu name');
                                setTimeout(() => interaction.deleteReply(), 10000);
                                return;
                            }

                            const affectedRows = await RoleMenu.update({ description: description }, { where: { name: menuName } });
                            if (affectedRows > 0) {
                                await interaction.reply(`Description of ${menuName} was removed successfully`);
                                setTimeout(() => interaction.deleteReply(), 10000);
                            } 

                            updateEmbed(interaction);

                        })(interaction);

                        return;
                }
        }

        switch (interaction.options.getSubcommand()) {
            case "create":
                // Creates the role menu

                (async (interaction) => {
                    const menuName = interaction.options.getString('menu');
                    const channel = (interaction.options.getChannel('channel') === null) ? interaction.channel : interaction.options.getChannel('channel');

                    if (menuName === null) {
                        await interaction.reply('Missing menu name')
                        setTimeout(() => interaction.deleteReply(), 1000);
                        return;
                    }

                    const menu = await RoleMenu.findOne({ where: {name: menuName} });
                    if (menu) {
                        await interaction.reply('Menu already exists with that name');
                        setTimeout(() => interaction.deleteReply(), 3000);
                        return;
                    }

                    try {
                        const rolemenu = await RoleMenu.create({
                            name: menuName,
                            channel_id: channel.id,
                            roles: JSON.stringify([]),
                        });
                        await interaction.reply(`Rolemenu ${rolemenu.name} added.`);
                        setTimeout(() => interaction.deleteReply(), 1000);

                        return;
                    }
                    catch (error) {
                        if (error.name === 'SequelizeUniqueConstraintError') {
                            await interaction.reply('That rolemenu already exists.');
                            setTimeout(() => interaction.deleteReply(), 1000);

                            return;
                        }
                        await interaction.reply(`Something went wrong with adding that rolemenu. ${error}`);
                        setTimeout(() => interaction.deleteReply(), 1000);

                        return;
                    }
                })(interaction);
                
                return;

            case "delete":
                // Deletes the targetted role menu

                (async (interaction) => {
                    const menuName = await interaction.options.getString('menu');

                    const rowCount = await RoleMenu.destroy({ where: { name: menuName } });
                    if (!rowCount) {
                        await interaction.reply('Invalid menu name');
                        setTimeout(() => interaction.deleteReply(), 1000);
                        return;
                    }

                    await interaction.reply('Menu deleted successfully');
                    setTimeout(() => interaction.deleteReply(), 1000);

                })(interaction);

                return;

            case "toggle":
                // Toggles the menu's visability

                let message_id = "";

                (async (interaction) => {

                    const menuName = await interaction.options.getString('menu');
                    const menu = await RoleMenu.findOne({ where: {name: menuName} })

                    if (!menu) {
                        await interaction.reply('Invalid menu name');
                        setTimeout(() => interaction.deleteReply(), 1000);
                        return;
                    }

                    const newVisability = !menu.enabled;
                    const currentChannel = interaction.guild.channels.cache.get(menu.channel_id);
                    
                    if (!newVisability) {

                        message = await currentChannel.messages.fetch(menu.message_id);
                        await message.delete();
                        
                        message_id = "";
                        
                    } else {

                        let roles = JSON.parse(menu.roles);
                        const newEmbed = buildEmbed(menu, roles);
                        
                        response = await currentChannel.send( {embeds: [newEmbed]} );

                        for (let role of roles) {
                            response.react(role['emoji'])
                        }

                        message_id = response.id;
                    }

                    const affectedRows = await RoleMenu.update({ enabled: newVisability, message_id: message_id }, { where: { name: menuName } });
                    if (affectedRows > 0) {
                        await interaction.reply(`${menuName} was edited and either shown or hidden`);
                        setTimeout(() => interaction.deleteReply(), 10000);
                        
                        return;
                    } 

                    await interaction.reply(`Could not find a menu with name ${menuName}`);
                    setTimeout(() => interaction.deleteReply(), 10000);

                    return;

                })(interaction);
                
                return;

            case "update":
                // Updates the embed if there where any changes made
                
                updateEmbed(interaction, true);

                return;

            case "color":
                // Updates the color of the embed

                (async (interaction) => {

                    const menuName = interaction.options.getString('menu');
                    const menu = await RoleMenu.findOne({ where: {name: menuName} });

                    if (!menu) {
                        await interaction.reply('Invalid menu name');
                        setTimeout(() => interaction.deleteReply(), 1000);
                        return;
                    }

                    const color = interaction.options.getString('color');

                    if (!(color.startsWith('#') && color.length === 7)) {
                        await interaction.reply('Invalid hex color please format it as #RRGGBB');
                        setTimeout(() => interaction.deleteReply(), 10000);

                        return;
                    }

                    const affectedRows = await RoleMenu.update({ color: color }, { where: { name: menuName } });
                    if (affectedRows > 0) {
                        await interaction.reply(`Color of ${menuName} was updated successfully`);
                        setTimeout(() => interaction.deleteReply(), 10000);
                    }

                    updateEmbed(interaction);
                    
                })(interaction);

                return;

            case "list":
                // Lists all available menus
                const roleMenuList = await RoleMenu.findAll({attributes: ['name']});
                const roleMenuString = roleMenuList.map(r => r.name).join(', ');

                await interaction.reply(`List of roles: [${roleMenuString}]`);
                setTimeout(() => interaction.deleteReply(), 1000);

                return;
        }
    },
};

function buildEmbed(menu, roles) {
    let description = (!menu.description) ? '' : menu.description + '\n\n';

    for (let role of roles) {
        description += `${role['emoji']} <@&${role['role']}> - ${role['description']}\n`
    }

    const newEmbed = new MessageEmbed()
        .setTitle(menu.name)
        .setDescription(description);
    
    if (menu.color) {
        newEmbed.setColor(menu.color);
    }

    return newEmbed;
}

async function updateEmbed(interaction, requireMessage = false) {
    const menuName = await interaction.options.getString('menu');
    const menu = await RoleMenu.findOne({ where: {name: menuName} })

    const currentChannel = interaction.guild.channels.cache.get(menu.channel_id);

    if (!menu.enabled) {
        if (requireMessage) {
            await interaction.reply('The targetted menu is not currently enabled!')
            setTimeout(() => interaction.deleteReply(), 10000);
        }
    
        return;
    }

    const message = await currentChannel.messages.fetch(menu.message_id);

    let roles = JSON.parse(menu.roles);
    const newEmbed = buildEmbed(menu, roles);

    message.edit({ embeds: [newEmbed] });
    message.reactions.removeAll();
    for (let role of roles) {
        message.react(role['emoji'])
    }

    if (requireMessage) {
        await interaction.reply(`Menu ${menuName} was updated successfully`);
        setTimeout(() => interaction.deleteReply(), 10000);
    }
}