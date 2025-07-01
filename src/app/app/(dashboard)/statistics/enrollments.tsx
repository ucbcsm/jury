'use client'
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons"
import { Avatar, Badge, Button, Dropdown, List, Typography } from "antd"

export function EnrollmentsStatistics(){
    return <List
                    dataSource={[
                      {
                        id: "1",
                        name: "Kahindo Lwanzo Alfred Loopodia",
                        status: "En attente",
                        promotion: "L1 Génie Informatique",
                      },
                      {
                        id: "2",
                        name: "Mumbere Jean-Pierre",
                        status: "Accepté",
                        promotion: "M2 Mathématiques",
                      },
                      {
                        id: "3",
                        name: "Kasereka Marie",
                        status: "Rejeté",
                        promotion: "D1 Physique",
                      },
                      {
                        id: "4",
                        name: "Muhindo Patrick",
                        status: "En attente",
                        promotion: "L2 Chimie",
                      },
                      {
                        id: "5",
                        name: "Katembo Alice",
                        status: "Accepté",
                        promotion: "M1 Biologie",
                      },
                      {
                        id: "6",
                        name: "Baluku Jean",
                        status: "Rejeté",
                        promotion: "Licence en Histoire",
                      },
                      {
                        id: "7",
                        name: "Kyavaghendi Sarah",
                        status: "En attente",
                        promotion: "Master en Géographie",
                      },
                      {
                        id: "8",
                        name: "Nzanzu Emmanuel",
                        status: "Accepté",
                        promotion: "Doctorat en Philosophie",
                      },
                      {
                        id: "9",
                        name: "Kavugho Esther",
                        status: "Rejeté",
                        promotion: "Licence en Littérature",
                      },
                      {
                        id: "10",
                        name: "Masika Dorcas",
                        status: "En attente",
                        promotion: "Master en Économie",
                      },
                      {
                        id: "11",
                        name: "Kambale David",
                        status: "Accepté",
                        promotion: "Doctorat en Droit",
                      },
                      {
                        id: "12",
                        name: "Mughendi Grace",
                        status: "Rejeté",
                        promotion: "Licence en Psychologie",
                      },
                      {
                        id: "13",
                        name: "Kavira Judith",
                        status: "En attente",
                        promotion: "Master en Sociologie",
                      },
                      {
                        id: "14",
                        name: "Mumbere Samuel",
                        status: "Accepté",
                        promotion: "Doctorat en Informatique",
                      },
                      {
                        id: "15",
                        name: "Kasereka Joseph",
                        status: "Rejeté",
                        promotion: "Licence en Biotechnologie",
                      },
                      {
                        id: "16",
                        name: "Muhindo Rebecca",
                        status: "En attente",
                        promotion: "Master en Physique",
                      },
                      {
                        id: "17",
                        name: "Kahindo Emmanuel",
                        status: "Accepté",
                        promotion: "Doctorat en Chimie",
                      },
                      {
                        id: "18",
                        name: "Masika Florence",
                        status: "Rejeté",
                        promotion: "Licence en Biologie",
                      },
                      {
                        id: "19",
                        name: "Baluku Patrick",
                        status: "En attente",
                        promotion: "Master en Mathématiques",
                      },
                      {
                        id: "20",
                        name: "Kavugho Alice",
                        status: "Accepté",
                        promotion: "Doctorat en Histoire",
                      },
                    ]}
                    renderItem={(item, index) => (
                      <List.Item
                        key={item.id}
                        extra={
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: "3",
                                  label: "Voir",
                                  icon: <EyeOutlined />,
                                },
                                {
                                  key: "4",
                                  label: "Accepter",
                                  icon: <CheckOutlined />,
                                },
                                {
                                  key: "5",
                                  label: "Rejeter",
                                  icon: <CloseOutlined />,
                                },
                                {
                                  key: "1",
                                  label: "Modifier",
                                  icon: <EditOutlined />,
                                },
                                {
                                  key: "2",
                                  label: "Supprimer",
                                  icon: <DeleteOutlined />,
                                  danger: true,
                                },
                              ],
                            }}
                          >
                            <Button icon={<MoreOutlined />} type="text" />
                          </Dropdown>
                        }
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                            />
                          }
                          title={
                            <>
                              <Badge  color="green" count="New" >{item.name}</Badge>
                            </>
                          }
                          description={
                            <>
                              <Typography.Text type="danger">
                                En attente
                              </Typography.Text>{" "}
                              : {item.promotion}
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                
}